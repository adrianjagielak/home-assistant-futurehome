import mqtt, { MqttClient } from "mqtt";

export function connectHub(opts: { hubIp: string; username: string; password: string; }): Promise<MqttClient> {
  const url = `mqtt://${opts.hubIp || "futurehome-smarthub.local"}`;
  return makeClient(url, 1884, opts.username, opts.password);
}

export async function connectHA(opts: { mqttHost: string; mqttPort: number; mqttUsername: string; mqttPassword: string; }): Promise<{ ha: MqttClient; retainedMessages: RetainedMessage[] }> {
  const url = `mqtt://${opts.mqttHost}`;
  let ha = await makeClient(url, opts.mqttPort, opts.mqttUsername, opts.mqttPassword);
  let retainedMessages = await waitForHARetainedMessages(ha)

  return { ha, retainedMessages };
}

function makeClient(url: string, port: number, username: string, password: string): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(url, { port, username, password, protocolVersion: 4 });
    client.once("connect", () => resolve(client));
    client.once("error", reject);
  });
}

type RetainedMessage = { topic: string; message: string };

async function waitForHARetainedMessages(
  client: MqttClient,
  timeoutMs = 3000
): Promise<RetainedMessage[]> {
  const topicPattern = /^homeassistant\/device\/futurehome.*$/;

  return new Promise((resolve, reject) => {
    const retainedMessages: RetainedMessage[] = [];

    const messageHandler = (topic: string, message: Buffer, packet: any) => {
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
