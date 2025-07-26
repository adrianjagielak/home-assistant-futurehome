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

export function complex_alarm_system__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  if (svc.intf?.includes('cmd.alarm.silence')) {
    const silenceCommandTopic = `${topicPrefix}${svc.addr}/silence/command`;

    components[`${svc.addr}_silence`] = {
      unique_id: `${svc.addr}_silence`,
      platform: 'button',
      name: 'Silence sirens without deactivating raised alarms',
      entity_category: 'config',
      icon: 'mdi:alarm-light-off',
      command_topic: silenceCommandTopic,
    };

    commandHandlers[silenceCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: svcName,
        cmd: 'cmd.alarm.silences',
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
