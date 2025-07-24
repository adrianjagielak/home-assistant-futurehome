import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { SelectComponent } from '../ha/mqtt_components/select';
import { NumberComponent } from '../ha/mqtt_components/number';
import { SensorComponent } from '../ha/mqtt_components/sensor';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';
import { SwitchComponent } from '../ha/mqtt_components/switch';

export function water_heater__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Extract supported modes, setpoints, and states from service properties
  const supportedModes = svc.props?.sup_modes || [
    'off',
    'normal',
    'boost',
    'eco',
  ];
  const supportedSetpoints = svc.props?.sup_setpoints || [];
  const supportedStates = svc.props?.sup_states || ['idle', 'heat'];
  const supRange = svc.props?.sup_range;
  const supRanges = svc.props?.sup_ranges;
  const supStep = svc.props?.sup_step || 1.0;

  // Determine temperature range and unit
  let minTemp = 0; // Default minimum
  let maxTemp = 100; // Default maximum
  const temperatureUnit = 'C'; // Default unit

  if (supRange) {
    minTemp = supRange.min ?? minTemp;
    maxTemp = supRange.max ?? maxTemp;
  }

  // 1. Mode Control (Select Component)
  if (supportedModes.length > 0) {
    const modeCommandTopic = `${topicPrefix}${svc.addr}/mode_command`;

    const selectComponent: SelectComponent = {
      unique_id: `${svc.addr}_mode`,
      platform: 'select',
      name: 'mode',
      options: supportedModes,
      command_topic: modeCommandTopic,
      optimistic: false,
      value_template: `{{ value_json['${svc.addr}'].mode }}`,
    };

    components[`${svc.addr}_mode`] = selectComponent;

    commandHandlers[modeCommandTopic] = async (payload: string) => {
      if (!supportedModes.includes(payload)) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'water_heater',
        cmd: 'cmd.mode.set',
        val_t: 'string',
        val: payload,
      });
    };
  }

  // 2. Setpoint Controls (Number Components)
  if (supportedSetpoints.length > 0) {
    for (const setpointType of supportedSetpoints) {
      const setpointCommandTopic = `${topicPrefix}${svc.addr}/setpoint_${setpointType}_command`;

      // Determine range for this specific setpoint
      let setpointMinTemp = minTemp;
      let setpointMaxTemp = maxTemp;

      if (supRanges && supRanges[setpointType]) {
        setpointMinTemp = supRanges[setpointType].min ?? minTemp;
        setpointMaxTemp = supRanges[setpointType].max ?? maxTemp;
      }

      const numberComponent: NumberComponent = {
        unique_id: `${svc.addr}_setpoint_${setpointType}`,
        platform: 'number',
        entity_category: 'config',
        name: `${setpointType} setpoint`,
        min: setpointMinTemp,
        max: setpointMaxTemp,
        step: supStep,
        unit_of_measurement: temperatureUnit === 'C' ? '°C' : '°F',
        command_topic: setpointCommandTopic,
        optimistic: false,
        value_template: `{{ value_json['${svc.addr}'].setpoint.${setpointType}.temp if value_json['${svc.addr}'].setpoint.${setpointType} else 0 }}`,
      };

      components[`${svc.addr}_setpoint_${setpointType}`] = numberComponent;

      commandHandlers[setpointCommandTopic] = async (payload: string) => {
        const temperature = parseFloat(payload);
        if (
          Number.isNaN(temperature) ||
          temperature < setpointMinTemp ||
          temperature > setpointMaxTemp
        ) {
          return;
        }

        await sendFimpMsg({
          address: svc.addr,
          service: 'water_heater',
          cmd: 'cmd.setpoint.set',
          val_t: 'object',
          val: {
            type: setpointType,
            temp: temperature,
            unit: temperatureUnit,
          },
        });
      };
    }
  }

  // 3. Operational State Sensor
  if (svc.intf?.includes('evt.state.report') && supportedStates.length > 0) {
    const sensorComponent: SensorComponent = {
      unique_id: `${svc.addr}_state`,
      platform: 'sensor',
      entity_category: 'diagnostic',
      name: 'operational state',
      value_template: `{{ value_json['${svc.addr}'].state }}`,
    };

    components[`${svc.addr}_state`] = sensorComponent;
  }

  // 4. Current Setpoint Temperature Sensor (shows active setpoint value)
  // This provides a way to see what temperature the water heater is currently targeting
  const currentSetpointSensorComponent: SensorComponent = {
    unique_id: `${svc.addr}_current_setpoint`,
    platform: 'sensor',
    entity_category: 'diagnostic',
    name: 'current setpoint',
    unit_of_measurement: temperatureUnit === 'C' ? '°C' : '°F',
    device_class: 'temperature',
    // Template to extract current setpoint based on active mode
    value_template: `{% set mode = value_json['${svc.addr}'].mode %}{% set setpoints = value_json['${svc.addr}'].setpoint %}{% if setpoints and setpoints[mode] %}{{ setpoints[mode].temp }}{% else %}unknown{% endif %}`,
  };

  components[`${svc.addr}_current_setpoint`] = currentSetpointSensorComponent;

  // 5. Power Control Switch (maps to mode on/off)
  const powerCommandTopic = `${topicPrefix}${svc.addr}/power_command`;

  const switchComponent: SwitchComponent = {
    unique_id: `${svc.addr}_power`,
    platform: 'switch',
    name: 'power',
    command_topic: powerCommandTopic,
    optimistic: false,
    value_template: `{{ 'ON' if value_json['${svc.addr}'].mode != 'off' else 'OFF' }}`,
    payload_on: 'ON',
    payload_off: 'OFF',
  };

  components[`${svc.addr}_power`] = switchComponent;

  commandHandlers[powerCommandTopic] = async (payload: string) => {
    let targetMode: string;

    switch (payload) {
      case 'ON':
        // Turn on to normal mode if available, otherwise first non-off mode
        targetMode = supportedModes.includes('normal')
          ? 'normal'
          : supportedModes.find((mode: any) => mode !== 'off') || 'normal';
        break;
      case 'OFF':
        targetMode = 'off';
        break;
      default:
        return;
    }

    if (supportedModes.includes(targetMode)) {
      await sendFimpMsg({
        address: svc.addr,
        service: 'water_heater',
        cmd: 'cmd.mode.set',
        val_t: 'string',
        val: targetMode,
      });
    }
  };

  return {
    components,
    commandHandlers,
  };
}
