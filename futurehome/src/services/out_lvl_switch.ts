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
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const commandTopic = `${topicPrefix}${svc.addr}/command`;

  const minLvl = svc.props?.min_lvl ?? 0;
  const maxLvl = svc.props?.max_lvl ?? 100;

  const isLightDevice = device.type?.type === 'light';

  if (isLightDevice) {
    // Use light component for light devices
    return {
      components: {
        [`${svc.addr}_light`]: {
          unique_id: `${svc.addr}_light`,
          platform: 'light',
          name: 'Light',
          brightness: true,
          brightness_scale: maxLvl,
          command_topic: commandTopic,
          optimistic: false,
          state_topic: `${topicPrefix}${svc.addr}/state`,
          state_value_template: `{% if value_json['${svc.addr}'].lvl > 0 %}ON{% else %}OFF{% endif %}`,
          brightness_state_topic: `${topicPrefix}${svc.addr}/state`,
          brightness_value_template: `{{ value_json['${svc.addr}'].lvl }}`,
        },
        
        // Remove the no longer needed `number` entity by setting it to an empty value
        [svc.addr]: {
          unique_id: svc.addr,
        } as any,
      },

      commandHandlers: {
        [commandTopic]: async (payload: string) => {
          const command = JSON.parse(payload);

          if (command.state === 'ON') {
            let lvl = maxLvl;
            if (command.brightness !== undefined) {
              lvl = Math.round(command.brightness);
            }

            await sendFimpMsg({
              address: svc.addr!,
              service: 'out_lvl_switch',
              cmd: 'cmd.lvl.set',
              val: lvl,
              val_t: 'int',
            });
          } else if (command.state === 'OFF') {
            await sendFimpMsg({
              address: svc.addr!,
              service: 'out_lvl_switch',
              cmd: 'cmd.lvl.set',
              val: minLvl,
              val_t: 'int',
            });
          } else if (command.brightness !== undefined) {
            const lvl = Math.round(command.brightness);

            await sendFimpMsg({
              address: svc.addr!,
              service: 'out_lvl_switch',
              cmd: 'cmd.lvl.set',
              val: lvl,
              val_t: 'int',
            });
          }
        },
      },
    };
  } else {
    // Use number component for non-light devices
    return {
      components: {
        [svc.addr]: {
          unique_id: svc.addr,
          platform: 'number',
          name: 'Level Switch',
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
}
