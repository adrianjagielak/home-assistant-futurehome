import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';

export function dev_sys__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  if (svc.intf?.includes('cmd.thing.reboot')) {
    const rebootCommandTopic = `${topicPrefix}${svc.addr}/reboot/command`;

    components[`${svc.addr}_reboot`] = {
      unique_id: `${svc.addr}_reboot`,
      platform: 'button',
      device_class: 'restart',
      entity_category: 'config',
      command_topic: rebootCommandTopic,
    };

    commandHandlers[rebootCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: svcName,
        cmd: 'cmd.thing.reboot',
        // App always sends a `null`. In theory some devices could support a force reboot, with `true` value.
        val_t: 'null',
        val: null,
      });
    };
  }

  // Nothing useful to expose?
  if (!Object.keys(components).length) return undefined;

  return {
    components,
    commandHandlers,
  };
}
