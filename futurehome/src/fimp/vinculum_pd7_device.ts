export type VinculumPd7Device = {
  client?: {
    // User-defined device name
    name?: string | null;
  } | null;
  id: number;
  // "Model" string, e.g. "zb - _TZ3040_bb6xaihh - TS0202"
  // The first one is the adapter, the second one is the manufacturer, the third one is the device model.
  model?: string | null;
  // Device model, e.g. "TS0202"
  modelAlias?: string | null;
  functionality?:
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
    | string
    | null;
  services?: Record<string, VinculumPd7Service> | null;
  type?: {
    // User-defined device type
    type?:
      | 'appliance'
      | 'battery'
      | 'blinds'
      | 'boiler'
      | 'chargepoint'
      | 'door_lock'
      | 'fan'
      | 'fire_detector'
      | 'garage_door'
      | 'gas_detector'
      | 'gate'
      | 'heat_detector'
      | 'heat_pump'
      | 'heater'
      | 'leak_detector'
      | 'light'
      | 'media_player'
      | 'meter'
      | 'sensor'
      | 'siren'
      | 'thermostat'
      | 'input'
      | 'water_valve'
      | string
      | null;
    // User-defined device subtype
    subtype?:
      | 'car_charger'
      | 'door'
      | 'door_lock'
      | 'garage'
      | 'lock'
      | 'main_elec'
      | 'presence'
      | 'scene'
      | 'window'
      | 'window_lock'
      | 'inverter'
      | string
      | null;
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
