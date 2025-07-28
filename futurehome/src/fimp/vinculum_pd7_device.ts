export type DeviceFunctionality =
  | 'appliance'
  | 'climate'
  | 'energy'
  | 'ev_charger'
  | 'lighting'
  | 'media'
  | 'other'
  | 'power'
  | 'safety'
  | 'security'
  | 'shading'
  | string;

export type DeviceType =
  | 'appliance'
  | 'battery'
  | 'blinds'
  | 'boiler'
  | 'chargepoint'
  | 'door_lock'
  | 'energy_storage'
  | 'fan'
  | 'fire_detector'
  | 'garage_door'
  | 'gas_detector'
  | 'gate'
  | 'heat_detector'
  | 'heat_pump'
  | 'heater'
  | 'input'
  | 'inverter'
  | 'leak_detector'
  | 'light'
  | 'media_player'
  | 'meter'
  | 'none'
  | 'sensor'
  | 'siren'
  | 'thermostat'
  | 'water_valve'
  | string;

export type DeviceSubType =
  | 'car_charger'
  | 'door'
  | 'door_lock'
  | 'garage'
  | 'lock'
  | 'main_elec'
  | 'none'
  | 'other'
  | 'presence'
  | 'scene'
  | 'window'
  | 'window_lock'
  | string;

export type VinculumPd7Device = {
  client?: {
    // User-defined device name
    name?: string | null;
  } | null;
  // FIMP Device ID.
  id: number;
  fimp?: {
    adapter?: 'zigbee' | 'zwave-ad' | string | null;
    // FIMP Device address (ID) in the context of its adapter.
    address?: string | null;
  } | null;
  // FIMP Thing Address (ID).
  thing?: string | null;
  // "Model" string, e.g. "zb - _TZ3040_bb6xaihh - TS0202"
  // The first one is the adapter, the second one is the manufacturer, the third one is the device model.
  model?: string | null;
  // Device model, e.g. "TS0202"
  modelAlias?: string | null;
  functionality?: DeviceFunctionality | null;
  services?: Record<string, VinculumPd7Service> | null;
  type?: {
    // User-defined device type
    type?: DeviceType | null;
    // User-defined device subtype
    subtype?: DeviceSubType | null;
    // Supported device types and subtypes for this device
    supported?: {
      [key: DeviceType]: DeviceSubType[];
    } | null;
  } | null;
};

export type VinculumPd7Service = {
  // Address of the service, e.g. "/rt:dev/rn:zigbee/ad:1/sv:color_ctrl/ad:3_1"
  addr: string;
  // Whether the service is enabled or not.
  enabled?: boolean | null;
  // Interfaces exposed by the service, e.g. ['cmd.meter.get_report','evt.meter.report'].
  intf?: string[] | null;
  // Properties of the service, e.g. ['sup_units'] or ['sup_modes','sup_setpoints','sup_temperatures'].
  props?: {
    [key: string]: any;
  } | null;
};
