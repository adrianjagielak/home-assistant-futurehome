import { exit } from 'process';
import { DemoFimpMqttClient } from './mqtt/demo_client';
import { IMqttClient } from './mqtt/interface';
import { RealMqttClient } from './mqtt/real_client';
import { log } from './logger';

export async function connectHub(opts: {
  hubIp: string;
  username: string;
  password: string;
  demo: boolean;
}): Promise<IMqttClient> {
  const url = `mqtt://${opts.hubIp}`;
  const fimp = await makeClient(
    url,
    1884,
    opts.username,
    opts.password,
    opts.demo,
  );
  fimp.once('disconnect', () => {
    log.error('Disconnected from Futurehome Smarthub');
    exit(1);
  });

  return fimp;
}

export async function connectHA(opts: {
  mqttHost: string;
  mqttPort: number;
  mqttUsername: string;
  mqttPassword: string;
}): Promise<{ ha: IMqttClient; retainedMessages: RetainedMessage[] }> {
  const url = `mqtt://${opts.mqttHost}`;
  const ha = await makeClient(
    url,
    opts.mqttPort,
    opts.mqttUsername,
    opts.mqttPassword,
    false,
  );
  ha.once('disconnect', () => {
    log.error("Disconnected from Home Assistant's MQTT broker");
    exit(1);
  });

  const retainedMessages = await waitForHARetainedMessages(ha);

  return { ha, retainedMessages };
}

function makeClient(
  url: string,
  port: number,
  username: string,
  password: string,
  demo: boolean,
): Promise<IMqttClient> {
  return new Promise((resolve, reject) => {
    const client = demo ? new DemoFimpMqttClient() : new RealMqttClient();
    client.connect(url, { port, username, password, protocolVersion: 4 });
    client.once('connect', () => {
      // Keep a listener after connecting: an 'error' without one crashes the process
      client.off('error', reject);
      client.on('error', (e) => log.warn(`MQTT error (${url})`, e));
      resolve(client);
    });
    client.on('error', reject);
  });
}

export type RetainedMessage = { topic: string; message: string };

async function waitForHARetainedMessages(
  client: IMqttClient,
  timeoutMs = 3000,
): Promise<RetainedMessage[]> {
  const topicPattern = /^homeassistant\/device\/futurehome.*$/;

  return new Promise((resolve, reject) => {
    const retainedMessages: RetainedMessage[] = [];

    const messageHandler = (
      topic: string,
      message: Buffer,
      packet: { retain?: boolean },
    ) => {
      if (packet.retain && topicPattern.test(topic)) {
        retainedMessages.push({ topic, message: message.toString() });
      }
    };

    const errorHandler = (err: Error) => {
      cleanup();
      reject(err);
    };

    const cleanup = () => {
      client.off('message', messageHandler);
      client.off('error', errorHandler);
    };

    client.on('message', messageHandler);
    client.on('error', errorHandler);

    // All discovery, state and command topics of this add-on live here
    client.subscribe('homeassistant/device/#', { qos: 1 }, (err) => {
      if (err) {
        cleanup();
        reject(err);
      }
    });

    setTimeout(() => {
      cleanup();
      resolve(retainedMessages);
    }, timeoutMs);
  });
}
