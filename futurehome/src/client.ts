import mqtt, { MqttClient } from "mqtt";

export function connectHub(opts: { hubIp: string; username: string; password: string; }): Promise<MqttClient> {
  const url = `mqtt://${opts.hubIp || "futurehome-smarthub.local"}`;
  return makeClient(url, 1884, opts.username, opts.password);
}

export function connectHA(opts: { mqttHost: string; mqttPort: number; mqttUsername: string; mqttPassword: string; }): Promise<MqttClient> {
  const url = `mqtt://${opts.mqttHost}`;
  return makeClient(url, opts.mqttPort, opts.mqttUsername, opts.mqttPassword);
}

function makeClient(url: string, port: number, username: string, password: string): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(url, { port, username, password, protocolVersion: 4 });
    client.once("connect", () => resolve(client));
    client.once("error", reject);
  });
}
