import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { SensorComponent } from '../ha/mqtt_components/sensor';
import { SwitchComponent } from '../ha/mqtt_components/switch';
import { NumberComponent } from '../ha/mqtt_components/number';
import { SelectComponent } from '../ha/mqtt_components/select';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';

export function chargepoint__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Extract supported properties
  const supStates = svc.props?.sup_states || [];
  const supChargingModes = svc.props?.sup_charging_modes || [];
  const supMaxCurrent = svc.props?.sup_max_current || 32;
  const supPhaseModes = svc.props?.sup_phase_modes || [];

  // Main chargepoint state sensor
  if (svc.intf?.includes('evt.state.report')) {
    const stateComponent: SensorComponent = {
      unique_id: `${svc.addr}_state`,
      platform: 'sensor',
      device_class: 'enum',
      options:
        supStates.length > 0
          ? supStates
          : [
              'disconnected',
              'ready_to_charge',
              'charging',
              'finished',
              'error',
              'unknown',
            ],
      value_template: `{{ value_json['${svc.addr}'].state | default('unknown') }}`,
      icon: 'mdi:ev-station',
      name: 'State',
    };
    components[`${svc.addr}_state`] = stateComponent;
  }

  // Cable lock switch (if supported)
  if (
    svc.intf?.includes('cmd.cable_lock.set') ||
    svc.intf?.includes('evt.cable_lock.report')
  ) {
    const cableLockCommandTopic = `${topicPrefix}${svc.addr}/cable_lock/command`;

    const cableLockComponent: SwitchComponent = {
      unique_id: `${svc.addr}_cable_lock`,
      platform: 'switch',
      command_topic: cableLockCommandTopic,
      optimistic: false,
      value_template: `{{ value_json['${svc.addr}'].cable_lock | default(false) | iif('ON', 'OFF') }}`,
      payload_on: 'true',
      payload_off: 'false',
      name: 'Cable Lock',
      icon: 'mdi:lock',
      entity_category: 'config',
    };
    components[`${svc.addr}_cable_lock`] = cableLockComponent;

    // Cable lock command handler
    commandHandlers[cableLockCommandTopic] = async (payload: string) => {
      const lockState = payload === 'true';

      await sendFimpMsg({
        address: svc.addr,
        service: 'chargepoint',
        cmd: 'cmd.cable_lock.set',
        val_t: 'bool',
        val: lockState,
      });
    };
  }

  // Current session energy sensor
  if (svc.intf?.includes('evt.current_session.report')) {
    const currentSessionComponent: SensorComponent = {
      unique_id: `${svc.addr}_current_session`,
      platform: 'sensor',
      device_class: 'energy',
      unit_of_measurement: 'kWh',
      state_class: 'total_increasing',
      value_template: `{{ value_json['${svc.addr}'].current_session | default(0) }}`,
      name: 'Current Session Energy',
      icon: 'mdi:lightning-bolt',
    };
    components[`${svc.addr}_current_session`] = currentSessionComponent;
  }

  // Maximum current setting
  if (
    svc.intf?.includes('cmd.max_current.set') ||
    svc.intf?.includes('evt.max_current.report')
  ) {
    const maxCurrentCommandTopic = `${topicPrefix}${svc.addr}/max_current/command`;

    const maxCurrentComponent: NumberComponent = {
      unique_id: `${svc.addr}_max_current`,
      platform: 'number',
      command_topic: maxCurrentCommandTopic,
      optimistic: false,
      min: 6,
      max: supMaxCurrent,
      step: 1,
      unit_of_measurement: 'A',
      device_class: 'current',
      value_template: `{{ value_json['${svc.addr}'].max_current | default(16) }}`,
      name: 'Maximum Current',
      icon: 'mdi:current-ac',
      entity_category: 'config',
    };
    components[`${svc.addr}_max_current`] = maxCurrentComponent;

    // Max current command handler
    commandHandlers[maxCurrentCommandTopic] = async (payload: string) => {
      const current = parseInt(payload, 10);
      if (Number.isNaN(current) || current < 6 || current > supMaxCurrent) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'chargepoint',
        cmd: 'cmd.max_current.set',
        val_t: 'int',
        val: current,
      });
    };
  }

  // Session current setting (if supported)
  if (svc.intf?.includes('cmd.current_session.set_current')) {
    const sessionCurrentCommandTopic = `${topicPrefix}${svc.addr}/session_current/command`;

    const sessionCurrentComponent: NumberComponent = {
      unique_id: `${svc.addr}_session_current`,
      platform: 'number',
      command_topic: sessionCurrentCommandTopic,
      optimistic: false,
      min: 6,
      max: supMaxCurrent,
      step: 1,
      unit_of_measurement: 'A',
      device_class: 'current',
      value_template: `{{ value_json['${svc.addr}'].offered_current | default(6) }}`,
      name: 'Session Current',
      icon: 'mdi:current-ac',
    };
    components[`${svc.addr}_session_current`] = sessionCurrentComponent;

    // Session current command handler
    commandHandlers[sessionCurrentCommandTopic] = async (payload: string) => {
      const current = parseInt(payload, 10);
      if (Number.isNaN(current) || current < 6 || current > supMaxCurrent) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'chargepoint',
        cmd: 'cmd.current_session.set_current',
        val_t: 'int',
        val: current,
      });
    };
  }

  // Phase mode selection (if 3-phase and supported)
  if (supPhaseModes.length > 0 && svc.intf?.includes('cmd.phase_mode.set')) {
    const phaseModeCommandTopic = `${topicPrefix}${svc.addr}/phase_mode/command`;

    const phaseModeComponent: SelectComponent = {
      unique_id: `${svc.addr}_phase_mode`,
      platform: 'select',
      command_topic: phaseModeCommandTopic,
      optimistic: false,
      options: supPhaseModes,
      value_template: `{{ value_json['${svc.addr}'].phase_mode | default('${supPhaseModes[0]}') }}`,
      name: 'Phase Mode',
      icon: 'mdi:sine-wave',
      entity_category: 'config',
    };
    components[`${svc.addr}_phase_mode`] = phaseModeComponent;

    // Phase mode command handler
    commandHandlers[phaseModeCommandTopic] = async (payload: string) => {
      if (!supPhaseModes.includes(payload)) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'chargepoint',
        cmd: 'cmd.phase_mode.set',
        val_t: 'string',
        val: payload,
      });
    };
  }

  // Charging mode selection (if supported)
  if (supChargingModes.length > 0) {
    const chargingModeComponent: SensorComponent = {
      unique_id: `${svc.addr}_charging_mode`,
      platform: 'sensor',
      device_class: 'enum',
      options: supChargingModes,
      value_template: `{{ value_json['${svc.addr}'].charging_mode | default('${supChargingModes[0]}') }}`,
      name: 'Charging Mode',
      icon: 'mdi:speedometer',
      entity_category: 'diagnostic',
    };
    components[`${svc.addr}_charging_mode`] = chargingModeComponent;
  }

  // Single charge control switch (combines start/stop functionality)
  if (
    svc.intf?.includes('cmd.charge.start') ||
    svc.intf?.includes('cmd.charge.stop')
  ) {
    const chargeControlCommandTopic = `${topicPrefix}${svc.addr}/charge_control/command`;

    const chargeControlComponent: SwitchComponent = {
      unique_id: `${svc.addr}_charge_control`,
      platform: 'switch',
      command_topic: chargeControlCommandTopic,
      optimistic: true,
      // Switch state reflects whether the charger is actively charging
      value_template: `{{ (value_json['${svc.addr}'].state == 'charging') | iif('ON', 'OFF') }}`,
      name: 'Charging',
      icon: 'mdi:ev-station',
    };
    components[`${svc.addr}_charge_control`] = chargeControlComponent;

    // Charge control command handler
    commandHandlers[chargeControlCommandTopic] = async (payload: string) => {
      if (payload === 'ON') {
        // Start charging
        if (svc.intf?.includes('cmd.charge.start')) {
          const props: any = {};

          // Add charging mode if supported and we have one set
          if (supChargingModes.length > 0) {
            props.charging_mode = supChargingModes[0]; // Use first available mode as default
          }

          await sendFimpMsg({
            address: svc.addr,
            service: 'chargepoint',
            cmd: 'cmd.charge.start',
            val_t: 'null',
            val: null,
            props: Object.keys(props).length > 0 ? props : undefined,
          });
        }
      } else if (payload === 'OFF') {
        // Stop charging
        if (svc.intf?.includes('cmd.charge.stop')) {
          await sendFimpMsg({
            address: svc.addr,
            service: 'chargepoint',
            cmd: 'cmd.charge.stop',
            val_t: 'null',
            val: null,
          });
        }
      }
    };
  }

  // Additional diagnostic sensors for properties that might be reported

  // Previous session energy (if available in reports)
  const previousSessionComponent: SensorComponent = {
    unique_id: `${svc.addr}_previous_session`,
    platform: 'sensor',
    device_class: 'energy',
    unit_of_measurement: 'kWh',
    state_class: 'total',
    value_template: `{{ value_json['${svc.addr}'].previous_session | default(0) }}`,
    name: 'Previous Session Energy',
    icon: 'mdi:lightning-bolt-outline',
    entity_category: 'diagnostic',
  };
  components[`${svc.addr}_previous_session`] = previousSessionComponent;

  // Offered current (dynamic load balancing value)
  const offeredCurrentComponent: SensorComponent = {
    unique_id: `${svc.addr}_offered_current`,
    platform: 'sensor',
    device_class: 'current',
    unit_of_measurement: 'A',
    state_class: 'measurement',
    value_template: `{{ value_json['${svc.addr}'].offered_current | default(0) }}`,
    name: 'Offered Current',
    icon: 'mdi:current-ac',
    entity_category: 'diagnostic',
  };
  components[`${svc.addr}_offered_current`] = offeredCurrentComponent;

  // Cable current (if reported)
  const cableCurrentComponent: SensorComponent = {
    unique_id: `${svc.addr}_cable_current`,
    platform: 'sensor',
    device_class: 'current',
    unit_of_measurement: 'A',
    state_class: 'measurement',
    value_template: `{{ value_json['${svc.addr}'].cable_current | default(0) }}`,
    name: 'Cable Current Capacity',
    icon: 'mdi:cable-data',
    entity_category: 'diagnostic',
  };
  components[`${svc.addr}_cable_current`] = cableCurrentComponent;

  return {
    components,
    commandHandlers,
  };
}
