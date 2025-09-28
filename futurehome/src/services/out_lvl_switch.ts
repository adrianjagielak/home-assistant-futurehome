import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';
import { haGetCachedState } from '../ha/update_state';

export function out_lvl_switch__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const lvlCommandTopic = `${topicPrefix}${svc.addr}/command`;
  const binaryCommandTopic = `${topicPrefix}${svc.addr}/binary/command`;
  const stateTopic = `${topicPrefix}/state`;

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
          command_topic: binaryCommandTopic,
          brightness_command_topic: lvlCommandTopic,
          optimistic: false,
          state_topic: stateTopic,
          state_value_template: `{{ (value_json['${svc.addr}'].lvl > 0) | iif('ON', 'OFF') }}`,
          brightness_state_topic: stateTopic,
          brightness_value_template: `{{ value_json['${svc.addr}'].lvl }}`,
        },
      },
      commandHandlers: {
        [lvlCommandTopic]: async (payload: string) => {
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
        [binaryCommandTopic]: async (payload: string) => {
          if (payload === 'ON') {
            // Skip setting to max brightness if the device is already on, because Home Assistant also sends "ON" when only changing brightness.
            const currentState = haGetCachedState({
              topic: `${topicPrefix}/state`,
            })?.[svc.addr];
            if (currentState.lvl > 0) {
              return;
            }

            if (svc.intf?.includes('cmd.binary.set')) {
              // Set level to the last known non-zero value (not supported in add-on demo mode)
              await sendFimpMsg({
                address: svc.addr!,
                service: 'out_lvl_switch',
                cmd: 'cmd.binary.set',
                val: payload === 'ON',
                val_t: 'bool',
              });
            } else {
              // Set level to max brightness
              await sendFimpMsg({
                address: svc.addr!,
                service: 'out_lvl_switch',
                cmd: 'cmd.lvl.set',
                val: maxLvl,
                val_t: 'int',
              });
            }
          } else {
            await sendFimpMsg({
              address: svc.addr!,
              service: 'out_lvl_switch',
              cmd: 'cmd.lvl.set',
              val: minLvl,
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
          command_topic: lvlCommandTopic,
          optimistic: false,
          value_template: `{{ value_json['${svc.addr}'].lvl }}`,
        },
      },

      commandHandlers: {
        [lvlCommandTopic]: async (payload: string) => {
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
