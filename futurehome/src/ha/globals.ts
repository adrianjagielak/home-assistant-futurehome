import { MqttClient } from "mqtt/*";

export let ha: MqttClient | undefined = undefined;

export function setHa(client: MqttClient) {
  ha = client;
}
