// src/futurehomeClient.ts
import axios from 'axios';
import { WebSocket } from 'ws';
import { URLSearchParams } from 'url';
import { FimpValueType } from '../fimp/fimp';
import { v4 as uuidv4 } from 'uuid';

/**
 * Logs in to the Thingsplex and extracts the tplex token.
 *
 * The use of Thingsplex is required for including and excluding devices,
 * as the regular Local API (SmartHub MQTT broker on port 1884)
 * does not support inclusion or exclusion commands.
 *
 * @param username - The login username
 * @param password - The login password
 * @returns The tplex token if login is successful
 */
export async function loginToThingsplex(parameters: {
  host: string;
  username: string;
  password: string;
}): Promise<string> {
  const url = `http://${parameters.host}:8081/fimp/login`;
  const payload = new URLSearchParams({
    username: parameters.username,
    password: parameters.password,
  }).toString();

  try {
    const response = await axios.post(url, payload, {
      maxRedirects: 0,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      validateStatus: (status) => status === 301,
    });

    const setCookie = response.headers['set-cookie'];
    if (!setCookie || setCookie.length === 0) {
      throw new Error('Set-Cookie header missing in login response');
    }

    const cookie = setCookie.find((c) => c.startsWith('tplex='));
    if (!cookie) {
      throw new Error('tplex cookie not found in Set-Cookie header');
    }

    const match = cookie.match(/tplex=([^;]+)/);
    if (!match) {
      throw new Error('Unable to extract tplex token from cookie');
    }

    return match[1];
  } catch (err) {
    throw new Error(`Login failed: ${(err as Error).message}`);
  }
}

/**
 * Connects to the Thingsplex websocket with the tplex token and sends the messages.
 *
 * The use of Thingsplex is required for including and excluding devices,
 * as the regular Local API (SmartHub MQTT broker on port 1884)
 * does not support inclusion or exclusion commands.
 *
 * @param token - The tplex token from login
 */
export function connectThingsplexWebSocketAndSend(
  parameters: {
    host: string;
    token: string;
  },
  messages: {
    address: string;
    service: string;
    cmd: string;
    val: unknown;
    val_t: FimpValueType;
    props?: any;
  }[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://${parameters.host}:8081/ws-bridge`, {
      headers: {
        Cookie: `tplex=${parameters.token}`,
      },
    });

    ws.on('open', () => {
      for (const msg of messages) {
        const message = {
          serv: msg.service,
          type: msg.cmd,
          val_t: msg.val_t,
          val: msg.val,
          props: msg.props,
          tags: null,
          resp_to: 'pt:j1/mt:rsp/rt:app/rn:tplex-ui/ad:1',
          src: 'tplex-ui',
          ver: '1',
          uid: uuidv4(),
          topic: msg.address,
        };

        ws.send(JSON.stringify(message));
      }
      ws.close(); // Close immediately after sending
    });

    ws.on('close', () => resolve());
    ws.on('error', (err) => reject(err));
  });
}
