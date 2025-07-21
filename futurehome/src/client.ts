import mqtt, { MqttClient } from "mqtt";

export function connectHub(opts: { hubIp: string; username: string; password: string; }): Promise<MqttClient> {
  const url = `mqtt://${opts.hubIp || "futurehome-smarthub.local"}`;
  return makeClient(url, opts.username, opts.password);
}

export function connectHA(): Promise<MqttClient> {
  const url = "mqtt://homeassistant";
  return makeClient(url);
}

function makeClient(url: string, username = "", password = ""): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(url, { username, password, protocolVersion: 4 });
    client.once("connect", () => resolve(client));
    client.once("error", reject);
  });
}
