import { IMqttClient } from '../mqtt/interface';
import { CommandHandlers } from './publish_device';

export let ha: IMqttClient | undefined = undefined;

export function setHa(client: IMqttClient) {
  ha = client;
}

export let haCommandHandlers: CommandHandlers | undefined = undefined;

export function setHaCommandHandlers(handlers: CommandHandlers) {
  haCommandHandlers = handlers;
}
