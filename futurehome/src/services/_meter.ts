import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { SensorComponent } from '../ha/mqtt_components/sensor';
import {
  SensorDeviceClass,
  SensorStateClass,
} from '../ha/mqtt_components/_enums';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';
import { sendFimpMsg } from '../fimp/fimp';
import { HaMqttComponent } from '../ha/mqtt_components/_component';

// Define meter value to device class mapping
const METER_VALUE_DEVICE_CLASS_MAP: Record<string, SensorDeviceClass> = {
  // Power values
  p_import: 'power',
  p1: 'power',
  p2: 'power',
  p3: 'power',
  p_export: 'power',
  p1_export: 'power',
  p2_export: 'power',
  p3_export: 'power',
  p_import_react: 'reactive_power',
  p1_import_react: 'reactive_power',
  p2_import_react: 'reactive_power',
  p3_import_react: 'reactive_power',
  p_export_react: 'reactive_power',
  p1_export_react: 'reactive_power',
  p2_export_react: 'reactive_power',
  p3_export_react: 'reactive_power',
  p_import_apparent: 'apparent_power',
  p1_import_apparent: 'apparent_power',
  p2_import_apparent: 'apparent_power',
  p3_import_apparent: 'apparent_power',
  p_export_apparent: 'apparent_power',
  p1_export_apparent: 'apparent_power',
  p2_export_apparent: 'apparent_power',
  p3_export_apparent: 'apparent_power',
  dc_p: 'power',

  // Energy values
  e_import: 'energy',
  e1_import: 'energy',
  e2_import: 'energy',
  e3_import: 'energy',
  e_export: 'energy',
  e1_export: 'energy',
  e2_export: 'energy',
  e3_export: 'energy',
  e_import_react: 'reactive_energy',
  e_export_react: 'reactive_energy',
  e_import_apparent: 'energy',
  e_export_apparent: 'energy',

  // Voltage values
  u: 'voltage',
  u1: 'voltage',
  u2: 'voltage',
  u3: 'voltage',
  u_export: 'voltage',
  u1_export: 'voltage',
  u2_export: 'voltage',
  u3_export: 'voltage',
  dc_u: 'voltage',

  // Current values
  i: 'current',
  i1: 'current',
  i2: 'current',
  i3: 'current',
  i_export: 'current',
  i1_export: 'current',
  i2_export: 'current',
  i3_export: 'current',
  dc_i: 'current',

  // Power factor
  p_factor: 'power_factor',
  p1_factor: 'power_factor',
  p2_factor: 'power_factor',
  p3_factor: 'power_factor',
  p_factor_export: 'power_factor',
  p1_factor_export: 'power_factor',
  p2_factor_export: 'power_factor',
  p3_factor_export: 'power_factor',

  // Frequency
  freq: 'frequency',

  // Gas meter
  // Using 'gas' device class for gas volumes

  // Water meter
  // Using 'water' device class for water volumes
};

// Define meter value to state class mapping
const METER_VALUE_STATE_CLASS_MAP: Record<string, SensorStateClass> = {
  // Energy values are typically total_increasing
  e_import: 'total_increasing',
  e1_import: 'total_increasing',
  e2_import: 'total_increasing',
  e3_import: 'total_increasing',
  e_export: 'total_increasing',
  e1_export: 'total_increasing',
  e2_export: 'total_increasing',
  e3_export: 'total_increasing',
  e_import_react: 'total_increasing',
  e_export_react: 'total_increasing',
  e_import_apparent: 'total_increasing',
  e_export_apparent: 'total_increasing',

  // Power values are measurements
  p_import: 'measurement',
  p1: 'measurement',
  p2: 'measurement',
  p3: 'measurement',
  p_export: 'measurement',
  p1_export: 'measurement',
  p2_export: 'measurement',
  p3_export: 'measurement',
  p_import_react: 'measurement',
  p1_import_react: 'measurement',
  p2_import_react: 'measurement',
  p3_import_react: 'measurement',
  p_export_react: 'measurement',
  p1_export_react: 'measurement',
  p2_export_react: 'measurement',
  p3_export_react: 'measurement',
  p_import_apparent: 'measurement',
  p1_import_apparent: 'measurement',
  p2_import_apparent: 'measurement',
  p3_import_apparent: 'measurement',
  p_export_apparent: 'measurement',
  p1_export_apparent: 'measurement',
  p2_export_apparent: 'measurement',
  p3_export_apparent: 'measurement',
  dc_p: 'measurement',

  // Voltage and current are measurements
  u: 'measurement',
  u1: 'measurement',
  u2: 'measurement',
  u3: 'measurement',
  u_export: 'measurement',
  u1_export: 'measurement',
  u2_export: 'measurement',
  u3_export: 'measurement',
  dc_u: 'measurement',
  i: 'measurement',
  i1: 'measurement',
  i2: 'measurement',
  i3: 'measurement',
  i_export: 'measurement',
  i1_export: 'measurement',
  i2_export: 'measurement',
  i3_export: 'measurement',
  dc_i: 'measurement',

  // Power factor is measurement
  p_factor: 'measurement',
  p1_factor: 'measurement',
  p2_factor: 'measurement',
  p3_factor: 'measurement',
  p_factor_export: 'measurement',
  p1_factor_export: 'measurement',
  p2_factor_export: 'measurement',
  p3_factor_export: 'measurement',

  // Frequency is measurement
  freq: 'measurement',

  // Gas/water volumes are typically total_increasing
  // (using generic names as they depend on meter configuration)
};

// Define friendly names for meter values
const METER_VALUE_NAMES: Record<string, string> = {
  // Power
  p_import: 'Power Import',
  p1: 'Power Phase 1',
  p2: 'Power Phase 2',
  p3: 'Power Phase 3',
  p_export: 'Power Export',
  p1_export: 'Power Export Phase 1',
  p2_export: 'Power Export Phase 2',
  p3_export: 'Power Export Phase 3',
  p_import_react: 'Reactive Power Import',
  p1_import_react: 'Reactive Power Import Phase 1',
  p2_import_react: 'Reactive Power Import Phase 2',
  p3_import_react: 'Reactive Power Import Phase 3',
  p_export_react: 'Reactive Power Export',
  p1_export_react: 'Reactive Power Export Phase 1',
  p2_export_react: 'Reactive Power Export Phase 2',
  p3_export_react: 'Reactive Power Export Phase 3',
  p_import_apparent: 'Apparent Power Import',
  p1_import_apparent: 'Apparent Power Import Phase 1',
  p2_import_apparent: 'Apparent Power Import Phase 2',
  p3_import_apparent: 'Apparent Power Import Phase 3',
  p_export_apparent: 'Apparent Power Export',
  p1_export_apparent: 'Apparent Power Export Phase 1',
  p2_export_apparent: 'Apparent Power Export Phase 2',
  p3_export_apparent: 'Apparent Power Export Phase 3',
  dc_p: 'DC Power',

  // Energy
  e_import: 'Energy Import',
  e1_import: 'Energy Import Phase 1',
  e2_import: 'Energy Import Phase 2',
  e3_import: 'Energy Import Phase 3',
  e_export: 'Energy Export',
  e1_export: 'Energy Export Phase 1',
  e2_export: 'Energy Export Phase 2',
  e3_export: 'Energy Export Phase 3',
  e_import_react: 'Reactive Energy Import',
  e_export_react: 'Reactive Energy Export',
  e_import_apparent: 'Apparent Energy Import',
  e_export_apparent: 'Apparent Energy Export',

  // Voltage
  u: 'Voltage',
  u1: 'Voltage Phase 1',
  u2: 'Voltage Phase 2',
  u3: 'Voltage Phase 3',
  u_export: 'Voltage Export',
  u1_export: 'Voltage Export Phase 1',
  u2_export: 'Voltage Export Phase 2',
  u3_export: 'Voltage Export Phase 3',
  dc_u: 'DC Voltage',

  // Current
  i: 'Current',
  i1: 'Current Phase 1',
  i2: 'Current Phase 2',
  i3: 'Current Phase 3',
  i_export: 'Current Export',
  i1_export: 'Current Export Phase 1',
  i2_export: 'Current Export Phase 2',
  i3_export: 'Current Export Phase 3',
  dc_i: 'DC Current',

  // Power Factor
  p_factor: 'Power Factor',
  p1_factor: 'Power Factor Phase 1',
  p2_factor: 'Power Factor Phase 2',
  p3_factor: 'Power Factor Phase 3',
  p_factor_export: 'Power Factor Export',
  p1_factor_export: 'Power Factor Export Phase 1',
  p2_factor_export: 'Power Factor Export Phase 2',
  p3_factor_export: 'Power Factor Export Phase 3',

  // Frequency
  freq: 'Frequency',
};

export function _meter__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Get supported units and extended values from service properties
  const supportedUnits = svc.props?.sup_units || [];
  const supportedExportUnits = svc.props?.sup_export_units || [];
  const supportedExtendedValues = svc.props?.sup_extended_vals || [];

  // Handle regular meter readings (meter.{unit}.val)
  // These typically come from evt.meter.report
  if (svc.intf?.includes('evt.meter.report')) {
    for (const unit of supportedUnits) {
      const componentId = `${svc.addr}_${unit}`;

      let friendlyName = 'Meter';
      let deviceClass: SensorDeviceClass | undefined;
      let stateClass: SensorStateClass = 'total_increasing'; // Default for meter readings

      // Set appropriate device class and name based on unit
      switch (unit) {
        case 'kWh':
          friendlyName = 'Energy';
          deviceClass = 'energy';
          break;
        case 'W':
          friendlyName = 'Power';
          deviceClass = 'power';
          stateClass = 'measurement';
          break;
        case 'A':
          friendlyName = 'Current';
          deviceClass = 'current';
          stateClass = 'measurement';
          break;
        case 'V':
          friendlyName = 'Voltage';
          deviceClass = 'voltage';
          stateClass = 'measurement';
          break;
        case 'VA':
          friendlyName = 'Apparent Power';
          deviceClass = 'apparent_power';
          stateClass = 'measurement';
          break;
        case 'kVAh':
          friendlyName = 'Apparent Energy';
          deviceClass = 'energy';
          break;
        case 'VAr':
          friendlyName = 'Reactive Power';
          deviceClass = 'reactive_power';
          stateClass = 'measurement';
          break;
        case 'kVArh':
          friendlyName = 'Reactive Energy';
          deviceClass = 'reactive_energy';
          break;
        case 'Hz':
          friendlyName = 'Frequency';
          deviceClass = 'frequency';
          stateClass = 'measurement';
          break;
        case 'power_factor':
          friendlyName = 'Power Factor';
          deviceClass = 'power_factor';
          stateClass = 'measurement';
          break;
        case 'pulse_c':
          friendlyName = 'Pulse Count';
          stateClass = 'total_increasing';
          break;
        case 'cub_m':
          friendlyName = 'Volume';
          deviceClass =
            svcName === 'meter_gas'
              ? 'gas'
              : svcName === 'meter_water'
                ? 'water'
                : 'volume';
          stateClass = 'total_increasing';
          break;
        case 'cub_f':
          friendlyName = 'Volume';
          deviceClass =
            svcName === 'meter_gas'
              ? 'gas'
              : svcName === 'meter_water'
                ? 'water'
                : 'volume';
          stateClass = 'total_increasing';
          break;
        case 'gallon':
          friendlyName = 'Volume';
          deviceClass =
            svcName === 'meter_gas'
              ? 'gas'
              : svcName === 'meter_water'
                ? 'water'
                : 'volume';
          stateClass = 'total_increasing';
          break;
        default:
          friendlyName = `Meter (${unit})`;
          break;
      }

      const component: SensorComponent = {
        unique_id: componentId,
        platform: 'sensor',
        entity_category: 'diagnostic',
        name: friendlyName,
        unit_of_measurement: unit,
        state_class: stateClass,
        value_template: `{{ value_json['${svc.addr}'].meter.${unit}.val | default(0) }}`,
      };

      if (deviceClass) {
        component.device_class = deviceClass;
      }

      // Set suggested display precision based on unit
      if (unit === 'kWh' || unit === 'kVAh' || unit === 'kVArh') {
        component.suggested_display_precision = 3;
      } else if (
        unit === 'W' ||
        unit === 'VA' ||
        unit === 'VAr' ||
        unit === 'V' ||
        unit === 'A'
      ) {
        component.suggested_display_precision = 1;
      } else if (unit === 'Hz') {
        component.suggested_display_precision = 2;
      } else if (unit === 'power_factor') {
        component.suggested_display_precision = 3;
      } else if (unit === 'cub_m' || unit === 'cub_f' || unit === 'gallon') {
        component.suggested_display_precision = 2;
      }

      components[componentId] = component;
    }
  }

  // Handle export meter readings (meter.{unit}.val) for bidirectional meters
  if (svc.intf?.includes('evt.meter_export.report')) {
    for (const unit of supportedExportUnits) {
      const componentId = `${svc.addr}_export_${unit}`;

      let friendlyName = 'Export Meter';
      let deviceClass: SensorDeviceClass | undefined;
      let stateClass: SensorStateClass = 'total_increasing'; // Default for meter readings

      // Set appropriate device class and name based on unit
      switch (unit) {
        case 'kWh':
          friendlyName = 'Energy Export';
          deviceClass = 'energy';
          break;
        case 'W':
          friendlyName = 'Power Export';
          deviceClass = 'power';
          stateClass = 'measurement';
          break;
        case 'A':
          friendlyName = 'Current Export';
          deviceClass = 'current';
          stateClass = 'measurement';
          break;
        case 'V':
          friendlyName = 'Voltage Export';
          deviceClass = 'voltage';
          stateClass = 'measurement';
          break;
        case 'VA':
          friendlyName = 'Apparent Power Export';
          deviceClass = 'apparent_power';
          stateClass = 'measurement';
          break;
        case 'kVAh':
          friendlyName = 'Apparent Energy Export';
          deviceClass = 'energy';
          break;
        case 'VAr':
          friendlyName = 'Reactive Power Export';
          deviceClass = 'reactive_power';
          stateClass = 'measurement';
          break;
        case 'kVArh':
          friendlyName = 'Reactive Energy Export';
          deviceClass = 'reactive_energy';
          break;
        default:
          friendlyName = `Export Meter (${unit})`;
          break;
      }

      const component: SensorComponent = {
        unique_id: componentId,
        platform: 'sensor',
        entity_category: 'diagnostic',
        name: friendlyName,
        unit_of_measurement: unit,
        state_class: stateClass,
        value_template: `{{ value_json['${svc.addr}'].meter_export.${unit}.val | default(0) }}`,
      };

      if (deviceClass) {
        component.device_class = deviceClass;
      }

      // Set suggested display precision
      if (unit === 'kWh' || unit === 'kVAh' || unit === 'kVArh') {
        component.suggested_display_precision = 3;
      } else if (
        unit === 'W' ||
        unit === 'VA' ||
        unit === 'VAr' ||
        unit === 'V' ||
        unit === 'A'
      ) {
        component.suggested_display_precision = 1;
      }

      components[componentId] = component;
    }
  }

  // Handle extended meter values (meter_ext.{value_name})
  // These typically come from evt.meter_ext.report and include detailed power/voltage/current readings
  if (
    svc.intf?.includes('evt.meter_ext.report') &&
    supportedExtendedValues.length > 0
  ) {
    for (const valueName of supportedExtendedValues) {
      const componentId = `${svc.addr}_ext_${valueName}`;
      const deviceClass = METER_VALUE_DEVICE_CLASS_MAP[valueName];
      const stateClass =
        METER_VALUE_STATE_CLASS_MAP[valueName] || 'measurement';
      const friendlyName =
        METER_VALUE_NAMES[valueName] ||
        valueName
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l: string) => l.toUpperCase());

      // Determine unit based on value name
      let unit = '';
      if (
        valueName.startsWith('p_') ||
        valueName.startsWith('p1') ||
        valueName.startsWith('p2') ||
        valueName.startsWith('p3') ||
        valueName === 'dc_p'
      ) {
        unit = 'W';
      } else if (
        valueName.startsWith('e_') ||
        valueName.startsWith('e1') ||
        valueName.startsWith('e2') ||
        valueName.startsWith('e3')
      ) {
        unit = 'kWh';
      } else if (
        valueName.startsWith('u_') ||
        valueName.startsWith('u1') ||
        valueName.startsWith('u2') ||
        valueName.startsWith('u3') ||
        valueName === 'dc_u'
      ) {
        unit = 'V';
      } else if (
        valueName.startsWith('i_') ||
        valueName.startsWith('i1') ||
        valueName.startsWith('i2') ||
        valueName.startsWith('i3') ||
        valueName === 'dc_i'
      ) {
        unit = 'A';
      } else if (valueName.includes('factor')) {
        unit = '';
      } else if (valueName === 'freq') {
        unit = 'Hz';
      }

      const component: SensorComponent = {
        unique_id: componentId,
        platform: 'sensor',
        entity_category: 'diagnostic',
        name: friendlyName,
        state_class: stateClass,
        value_template: `{{ value_json['${svc.addr}'].meter_ext.${valueName} | default(0) }}`,
      };

      if (unit) {
        component.unit_of_measurement = unit;
      }

      if (deviceClass) {
        component.device_class = deviceClass;
      }

      // Set suggested display precision
      if (unit === 'kWh') {
        component.suggested_display_precision = 3;
      } else if (unit === 'W' || unit === 'V' || unit === 'A') {
        component.suggested_display_precision = 1;
      } else if (unit === 'Hz') {
        component.suggested_display_precision = 2;
      } else if (valueName.includes('factor')) {
        component.suggested_display_precision = 3;
      }

      components[componentId] = component;
    }
  }

  // Handle meter reset button if supported
  if (svc.intf?.includes('cmd.meter.reset')) {
    const resetCommandTopic = `${topicPrefix}${svc.addr}/reset/command`;

    components[`${svc.addr}_reset`] = {
      unique_id: `${svc.addr}_reset`,
      platform: 'button',
      name: 'Reset Meter',
      entity_category: 'config',
      icon: 'mdi:restart',
      command_topic: resetCommandTopic,
    };

    commandHandlers[resetCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: svcName,
        cmd: 'cmd.meter.reset',
        val_t: 'null',
        val: null,
      });
    };
  }

  return {
    components,
    commandHandlers,
  };
}
