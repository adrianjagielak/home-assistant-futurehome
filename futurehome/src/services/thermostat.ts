// Maps a Futurehome “thermostat” service to one MQTT *climate* entity.
// ─────────────────────────────────────────────────────────────────────────
// FIMP ➞ HA state path used by the templates
//   value_json[svc.addr].mode             – current HVAC mode
//   value_json[svc.addr].setpoint.temp    – set-point temperature (string)
//
// HA ➞ FIMP commands
//   mode_command_topic        → cmd.mode.set
//   temperature_command_topic → cmd.setpoint.set
// ─────────────────────────────────────────────────────────────────────────

import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ClimateComponent } from '../ha/mqtt_components/climate';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';
import { haGetCachedState } from '../ha/update_state';

export function thermostat__components(
  topicPrefix: string,
  _device: VinculumPd7Device,
  svc: VinculumPd7Service,
): ServiceComponentsCreationResult | undefined {
  const supModes: string[] = svc.props?.sup_modes ?? [];
  const supSetpoints: string[] = svc.props?.sup_setpoints ?? [];

  if (!supModes.length) return undefined; // nothing useful to expose

  const defaultSpType = supSetpoints[0] ?? 'heat';

  const ranges: Record<string, { min?: number; max?: number }> =
    svc.props?.sup_temperatures ?? {};
  const step: number = svc.props?.sup_step ?? 0.5;

  // Determine overall min/max temp from all advertised ranges
  let minTemp = 1000;
  let maxTemp = -1000;
  for (const sp of supSetpoints) {
    minTemp = Math.min(minTemp, ranges[sp]?.min ?? minTemp);
    maxTemp = Math.max(maxTemp, ranges[sp]?.max ?? maxTemp);
  }
  if (minTemp === 1000) minTemp = 7;
  if (maxTemp === -1000) maxTemp = 35;

  // Shared JSON blob
  const stateTopic = `${topicPrefix}/state`;

  // ───────────── command topics ─────────────
  const modeCmdTopic = `${topicPrefix}${svc.addr}/mode/command`;
  const tempCmdTopic = `${topicPrefix}${svc.addr}/temperature/command`;

  // ───────────── MQTT climate component ─────────────
  const climate: ClimateComponent = {
    unique_id: svc.addr,
    platform: 'climate',

    // HVAC modes
    modes: supModes,
    mode_command_topic: modeCmdTopic,
    // Even though state topic is often optional as it's already defined by the device object this component is in, the 'climate' expects it
    mode_state_topic: stateTopic,
    mode_state_template: `{{ value_json['${svc.addr}'].mode }}`,

    // Temperature
    temperature_command_topic: tempCmdTopic,
    temperature_state_topic: stateTopic,
    temperature_state_template: `{{ value_json['${svc.addr}'].setpoint.temp }}`,

    // Limits / resolution
    min_temp: minTemp,
    max_temp: maxTemp,
    temp_step: step,

    optimistic: true,
  };

  // ───────────── command handlers ─────────────
  const handlers: CommandHandlers = {
    [modeCmdTopic]: async (payload: string) => {
      if (!supModes.includes(payload)) return;
      await sendFimpMsg({
        address: svc.addr!,
        service: 'thermostat',
        cmd: 'cmd.mode.set',
        val_t: 'string',
        val: payload,
      });
    },

    [tempCmdTopic]: async (payload: string) => {
      const t = parseFloat(payload);
      if (Number.isNaN(t)) return;

      await sendFimpMsg({
        address: svc.addr!,
        service: 'thermostat',
        cmd: 'cmd.setpoint.set',
        val_t: 'str_map',
        val: {
          type:
            haGetCachedState({ topic: `${topicPrefix}/state` })?.[svc.addr]
              ?.mode ?? defaultSpType,
          temp: payload,
          unit: 'C',
        },
      });
    },
  };

  return {
    components: { [svc.addr]: climate },
    commandHandlers: handlers,
  };
}
