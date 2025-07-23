import { MqttClient } from "mqtt/*";
import { CommandHandlers } from "./publish_device";

export let ha: MqttClient | undefined = undefined;

export function setHa(client: MqttClient) {
  ha = client;
}

export let haCommandHandlers: CommandHandlers | undefined = undefined;

export function setHaCommandHandlers(handlers: CommandHandlers) {
  haCommandHandlers = handlers;
}
