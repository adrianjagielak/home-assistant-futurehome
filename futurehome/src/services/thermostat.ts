import { sendFimpMsg } from '../fimp/fimp';
import { replaceSvcInAddr } from '../fimp/helpers';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { ClimateComponent } from '../ha/mqtt_components/climate';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';
import { haGetCachedState } from '../ha/update_state';

export function thermostat__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Extract supported properties
  const supModes = svc.props?.sup_modes || [];
  const supSetpoints = svc.props?.sup_setpoints || [];
  const supStates = svc.props?.sup_states || [];
  const supTemperatures = svc.props?.sup_temperatures || {};
  const supStep = svc.props?.sup_step || 0.5;

  // Main climate component
  const stateTopic = `${topicPrefix}/state`;
  const modeCommandTopic = `${topicPrefix}${svc.addr}/mode/command`;
  const tempCommandTopic = `${topicPrefix}${svc.addr}/temperature/command`;
  const tempHighCommandTopic = `${topicPrefix}${svc.addr}/temperature_high/command`;
  const tempLowCommandTopic = `${topicPrefix}${svc.addr}/temperature_low/command`;

  // Map FIMP modes to Home Assistant modes
  const mapFimpToHaMode = (fimpMode: string): string => {
    const modeMap: Record<string, string> = {
      off: 'off',
      heat: 'heat',
      cool: 'cool',
      auto: 'auto',
      auto_changeover: 'auto',
      fan: 'fan_only',
      fan_only: 'fan_only',
      dry: 'dry',
      dry_air: 'dry',
      aux_heat: 'heat',
      energy_heat: 'heat',
      energy_cool: 'cool',
    };
    return modeMap[fimpMode] || fimpMode;
  };

  // Map Home Assistant modes back to FIMP modes
  const mapHaToFimpMode = (haMode: string): string => {
    // Find the first FIMP mode that maps to this HA mode
    const reverseMap: Record<string, string> = {
      off: 'off',
      heat: 'heat',
      cool: 'cool',
      auto: 'auto',
      fan_only: 'fan_only',
      dry: 'dry',
    };

    // If we have the exact mode in supported modes, use it
    if (supModes.includes(haMode)) {
      return haMode;
    }

    // Otherwise try to find a suitable FIMP mode
    const fimpMode = reverseMap[haMode];
    if (fimpMode && supModes.includes(fimpMode)) {
      return fimpMode;
    }

    // Special cases for fan_only
    if (haMode === 'fan_only') {
      if (supModes.includes('fan')) return 'fan';
      if (supModes.includes('fan_only')) return 'fan_only';
    }

    // Special cases for auto
    if (haMode === 'auto') {
      if (supModes.includes('auto')) return 'auto';
      if (supModes.includes('auto_changeover')) return 'auto_changeover';
    }

    return haMode; // Fallback to original
  };

  // Get supported HA modes
  const haModes = supModes
    .map(mapFimpToHaMode)
    .filter(
      (mode: string, index: number, arr: string[]) =>
        arr.indexOf(mode) === index,
    );

  // Determine temperature ranges
  let minTemp: number | undefined;
  let maxTemp: number | undefined;

  // Find the broadest temperature range from all setpoints
  for (const setpoint of supSetpoints) {
    const range = supTemperatures[setpoint];
    if (range) {
      if (minTemp === undefined || range.min < minTemp) {
        minTemp = range.min;
      }
      if (maxTemp === undefined || range.max > maxTemp) {
        maxTemp = range.max;
      }
    }
  }

  const climateComponent: ClimateComponent = {
    unique_id: svc.addr,
    platform: 'climate',
    name: 'Thermostat',
    modes: haModes,
    mode_command_topic: modeCommandTopic,
    // mode_state_topic seems to be required for mode state to be reported correctly in HA
    mode_state_topic: stateTopic,
    mode_state_template: `{{ value_json['${svc.addr}'].mode | default('off') }}`,
    optimistic: false,
    temp_step: supStep,
    temperature_unit: 'C',
  };

  // Add current temperature from paired sensor_temp service
  const sensorTempAddr = replaceSvcInAddr(svc.addr, 'sensor_temp');
  climateComponent.current_temperature_topic = stateTopic;
  climateComponent.current_temperature_template = `{{ value_json['${sensorTempAddr}'].sensor | default(0) }}`;

  // Add action/state reporting if supported
  if (supStates.length > 0) {
    climateComponent.action_topic = stateTopic;
    climateComponent.action_template = `{% set state = value_json['${svc.addr}'].state | default('idle') %}{{ {'idle': 'idle', 'heat': 'heating', 'cool': 'cooling', 'fan': 'fan'}.get(state, 'off') }}`;
  }

  // Add temperature ranges if available
  if (minTemp !== undefined) {
    climateComponent.min_temp = minTemp;
  }
  if (maxTemp !== undefined) {
    climateComponent.max_temp = maxTemp;
  }

  // Handle different setpoint configurations
  if (supSetpoints.includes('heat') && supSetpoints.includes('cool')) {
    // Dual setpoint system (heat/cool)
    climateComponent.temperature_high_command_topic = tempHighCommandTopic;
    climateComponent.temperature_low_command_topic = tempLowCommandTopic;
    climateComponent.temperature_high_state_topic = stateTopic;
    climateComponent.temperature_low_state_topic = stateTopic;
    climateComponent.temperature_high_state_template = `{{ value_json['${svc.addr}'].setpoint.cool.temp | default(25) }}`;
    climateComponent.temperature_low_state_template = `{{ value_json['${svc.addr}'].setpoint.heat.temp | default(20) }}`;
  } else if (supSetpoints.length > 0) {
    // Single setpoint system
    climateComponent.temperature_command_topic = tempCommandTopic;
    climateComponent.temperature_state_topic = stateTopic;
    // Use the first available setpoint or try to find the current mode's setpoint
    const primarySetpoint = supSetpoints[0];
    climateComponent.temperature_state_template = `{% set mode = value_json['${svc.addr}'].mode | default('${primarySetpoint}') %}{% set setpoint = value_json['${svc.addr}'].setpoint %}{% if setpoint[mode] %}{{ setpoint[mode].temp | default(20) }}{% else %}{{ setpoint['${primarySetpoint}'].temp | default(20) }}{% endif %}`;
  }

  components[svc.addr] = climateComponent;

  // Command handlers

  // Mode command handler
  commandHandlers[modeCommandTopic] = async (payload: string) => {
    const fimpMode = mapHaToFimpMode(payload);

    if (!supModes.includes(fimpMode)) {
      return;
    }

    await sendFimpMsg({
      address: svc.addr,
      service: 'thermostat',
      cmd: 'cmd.mode.set',
      val_t: 'string',
      val: fimpMode,
    });
  };

  // Single temperature command handler
  if (climateComponent.temperature_command_topic) {
    commandHandlers[tempCommandTopic] = async (payload: string) => {
      const temp = parseFloat(payload);
      if (Number.isNaN(temp)) {
        return;
      }

      // Get current mode to determine which setpoint to set
      const currentState = haGetCachedState({
        topic: `${topicPrefix}/state`,
      })?.[svc.addr];
      const currentMode = currentState?.mode || supSetpoints[0];

      // Use the mode as setpoint type if it's in sup_setpoints, otherwise use the first available setpoint
      const setpointType = supSetpoints.includes(currentMode)
        ? currentMode
        : supSetpoints[0];

      await sendFimpMsg({
        address: svc.addr,
        service: 'thermostat',
        cmd: 'cmd.setpoint.set',
        val_t: 'str_map',
        val: {
          type: setpointType,
          temp: temp.toString(),
          unit: 'C',
        },
      });
    };
  }

  // High temperature command handler (for dual setpoint systems)
  if (climateComponent.temperature_high_command_topic) {
    commandHandlers[tempHighCommandTopic] = async (payload: string) => {
      const temp = parseFloat(payload);
      if (Number.isNaN(temp)) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'thermostat',
        cmd: 'cmd.setpoint.set',
        val_t: 'str_map',
        val: {
          type: 'cool',
          temp: temp.toString(),
          unit: 'C',
        },
      });
    };
  }

  // Low temperature command handler (for dual setpoint systems)
  if (climateComponent.temperature_low_command_topic) {
    commandHandlers[tempLowCommandTopic] = async (payload: string) => {
      const temp = parseFloat(payload);
      if (Number.isNaN(temp)) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'thermostat',
        cmd: 'cmd.setpoint.set',
        val_t: 'str_map',
        val: {
          type: 'heat',
          temp: temp.toString(),
          unit: 'C',
        },
      });
    };
  }

  return {
    components,
    commandHandlers,
  };
}
