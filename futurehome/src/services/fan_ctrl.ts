import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function fan_ctrl__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const supModes: string[] = svc.props?.sup_modes ?? [];

  if (!supModes.length) return undefined; // nothing useful to expose

  const commandTopic = `${topicPrefix}${svc.addr}/command`;

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'fan',
        name: 'Fan',
        command_topic: commandTopic,
        optimistic: false,
        preset_modes: supModes,
        preset_mode_command_topic: commandTopic,
        preset_mode_value_template: `{{ value_json['${svc.addr}'].mode }}`,
        // Fan is considered "on" if mode is not off/stop
        state_value_template: `{{ 'ON' if value_json['${svc.addr}'].mode not in ['off', 'stop'] else 'OFF' }}`,
      },
    },

    commandHandlers: {
      [commandTopic]: async (payload: string) => {
        // Handle both on/off commands and preset mode commands
        if (payload === 'ON' || payload === 'OFF') {
          // For simple on/off, use the first available mode for "on"
          const mode = payload === 'ON' ? supModes[0] : 'off';

          if (supModes.includes(mode) || mode === 'off') {
            await sendFimpMsg({
              address: svc.addr!,
              service: 'fan_ctrl',
              cmd: 'cmd.mode.set',
              val: mode,
              val_t: 'string',
            });
          }
        } else {
          // Treat as preset mode command
          if (supModes.includes(payload)) {
            await sendFimpMsg({
              address: svc.addr!,
              service: 'fan_ctrl',
              cmd: 'cmd.mode.set',
              val: payload,
              val_t: 'string',
            });
          }
        }
      },
    },
  };
}
