import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function out_lvl_switch__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
): ServiceComponentsCreationResult | undefined {
  const commandTopic = `${topicPrefix}${svc.addr}/command`;

  const minLvl = svc.props?.min_lvl ?? 0;
  const maxLvl = svc.props?.max_lvl ?? 100;

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'number',
        min: minLvl,
        max: maxLvl,
        step: 1,
        command_topic: commandTopic,
        optimistic: false,
        value_template: `{{ value_json['${svc.addr}'].lvl }}`,
      },
    },

    commandHandlers: {
      [commandTopic]: async (payload: string) => {
        const lvl = parseInt(payload, 10);
        if (Number.isNaN(lvl)) {
          return;
        }

        await sendFimpMsg({
          address: svc.addr!,
          service: 'out_lvl_switch',
          cmd: 'cmd.lvl.set',
          val: lvl,
          val_t: 'int',
        });
      },
    },
  };
}
