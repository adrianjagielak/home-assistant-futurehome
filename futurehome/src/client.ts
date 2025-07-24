import { DemoFimpMqttClient } from './mqtt/demo_client';
import { IMqttClient } from './mqtt/interface';
import { RealMqttClient } from './mqtt/real_client';

export function connectHub(opts: {
  hubIp: string;
  username: string;
  password: string;
  demo: boolean;
}): Promise<IMqttClient> {
  const url = `mqtt://${opts.hubIp}`;
  return makeClient(url, 1884, opts.username, opts.password, opts.demo);
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
    client.once('connect', () => resolve(client));
    client.once('error', reject);
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

    client.subscribe('#', { qos: 1 }, (err) => {
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
