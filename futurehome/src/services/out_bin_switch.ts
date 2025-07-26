import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function out_bin_switch__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const commandTopic = `${topicPrefix}${svc.addr}/command`;

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'switch',
        name: 'Binary Switch',
        command_topic: commandTopic,
        optimistic: false,
        value_template: `{{ (value_json['${svc.addr}'].binary) | iif('ON', 'OFF') }}`,
      },
    },
    commandHandlers: {
      [commandTopic]: async (payload: string) => {
        await sendFimpMsg({
          address: svc.addr!,
          service: 'out_bin_switch',
          cmd: 'cmd.binary.set',
          val: payload === 'ON',
          val_t: 'bool',
        });
      },
    },
  };
}
