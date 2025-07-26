import { sendFimpMsg } from '../fimp/fimp';
import { replaceSvcInAddr } from '../fimp/helpers';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';
import { haGetCachedState } from '../ha/update_state';

export function water_heater__components(
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
  const supRange = svc.props?.sup_range;
  const supRanges = svc.props?.sup_ranges;
  const supStep = svc.props?.sup_step || 1.0;

  // Determine temperature range
  let minTemp = 0; // Default minimum
  let maxTemp = 100; // Default maximum

  if (supRange) {
    minTemp = supRange.min;
    maxTemp = supRange.max;
  } else if (supRanges) {
    // Find the broadest range from all setpoint ranges
    for (const setpoint of supSetpoints) {
      const range = supRanges[setpoint];
      if (range) {
        if (range.min < minTemp) minTemp = range.min;
        if (range.max > maxTemp) maxTemp = range.max;
      }
    }
  }

  // Main water heater component
  const stateTopic = `${topicPrefix}/state`;
  const modeCommandTopic = `${topicPrefix}${svc.addr}/mode/command`;
  const tempCommandTopic = `${topicPrefix}${svc.addr}/temperature/command`;

  // Map FIMP modes to appropriate Home Assistant water heater modes
  const mapFimpToHaMode = (fimpMode: string): string => {
    const modeMap: Record<string, string> = {
      off: 'off',
      normal: 'heat_pump',
      boost: 'high_demand',
      eco: 'eco',
    };
    return modeMap[fimpMode] || fimpMode;
  };

  // Map Home Assistant modes back to FIMP modes
  const mapHaToFimpMode = (haMode: string): string => {
    const reverseMap: Record<string, string> = {
      off: 'off',
      heat_pump: 'normal',
      high_demand: 'boost',
      eco: 'eco',
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

    return haMode; // Fallback to original
  };

  // Get supported HA modes
  const haModes = supModes
    .map(mapFimpToHaMode)
    .filter(
      (mode: string, index: number, arr: string[]) =>
        arr.indexOf(mode) === index,
    );

  // Water heater component configuration
  const waterHeaterComponent: HaMqttComponent = {
    unique_id: svc.addr,
    platform: 'water_heater',
    name: 'Water heater',
    modes: haModes.length > 0 ? haModes : ['off', 'heat_pump'],
    mode_command_topic: modeCommandTopic,
    mode_state_topic: stateTopic,
    mode_state_template: `{{ value_json['${svc.addr}'].mode | default('off') }}`,
    optimistic: false,
    min_temp: minTemp,
    max_temp: maxTemp,
    temperature_unit: 'C',
    precision: supStep >= 1 ? 1 : 0.1,
  };

  // Add current temperature from paired sensor_wattemp service
  const sensorWattempAddr = replaceSvcInAddr(svc.addr, 'sensor_wattemp');
  waterHeaterComponent.current_temperature_topic = stateTopic;
  waterHeaterComponent.current_temperature_template = `{{ value_json['${sensorWattempAddr}'].sensor | default(0) }}`;

  // Add operation state if supported
  if (supStates.length > 0) {
    // Map FIMP states to Home Assistant water heater states
    waterHeaterComponent.value_template = `{% set state = value_json['${svc.addr}'].state | default('idle') %}{{ {'idle': 'idle', 'heat': 'heating'}.get(state, 'idle') }}`;
  }

  // Handle temperature control based on available setpoints
  if (supSetpoints.length > 0) {
    waterHeaterComponent.temperature_command_topic = tempCommandTopic;
    waterHeaterComponent.temperature_state_topic = stateTopic;

    // Create template to get current temperature setpoint based on mode
    // Priority: current mode setpoint > normal setpoint > first available setpoint
    const setpointTemplate = `{% set mode = value_json['${svc.addr}'].mode | default('normal') %}{% set setpoint = value_json['${svc.addr}'].setpoint %}{% if setpoint[mode] %}{{ setpoint[mode].temp | default(${minTemp}) }}{% elif setpoint['normal'] %}{{ setpoint['normal'].temp | default(${minTemp}) }}{% elif setpoint %}{{ setpoint['${supSetpoints[0]}'].temp | default(${minTemp}) }}{% else %}{{ ${minTemp} }}{% endif %}`;

    waterHeaterComponent.temperature_state_template = setpointTemplate;
  }

  components[svc.addr] = waterHeaterComponent;

  // Command handlers

  // Mode command handler
  commandHandlers[modeCommandTopic] = async (payload: string) => {
    const fimpMode = mapHaToFimpMode(payload);

    if (!supModes.includes(fimpMode)) {
      return;
    }

    await sendFimpMsg({
      address: svc.addr,
      service: 'water_heater',
      cmd: 'cmd.mode.set',
      val_t: 'string',
      val: fimpMode,
    });
  };

  // Temperature command handler
  if (waterHeaterComponent.temperature_command_topic) {
    commandHandlers[tempCommandTopic] = async (payload: string) => {
      const temp = parseFloat(payload);
      if (Number.isNaN(temp)) {
        return;
      }

      // Validate temperature is within supported range
      if (temp < minTemp || temp > maxTemp) {
        return;
      }

      // Get current mode to determine which setpoint to set
      const currentState = haGetCachedState({
        topic: `${topicPrefix}/state`,
      })?.[svc.addr];
      const currentMode = currentState?.mode || 'normal';

      // Use the current mode as setpoint type if it's in sup_setpoints
      // Otherwise use 'normal' as default, or first available setpoint
      let setpointType = 'normal';
      if (supSetpoints.includes(currentMode)) {
        setpointType = currentMode;
      } else if (!supSetpoints.includes('normal') && supSetpoints.length > 0) {
        setpointType = supSetpoints[0];
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'water_heater',
        cmd: 'cmd.setpoint.set',
        val_t: 'object',
        val: {
          type: setpointType,
          temp: temp,
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
