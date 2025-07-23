export type VinculumPd7Device = {
  client?: {
    // User-defined device name
    name?: string | null;
  } | null;
  id: number;
  // "Model", e.g. "zb - _TZ3040_bb6xaihh - TS0202"
  model?: string | null;
  // "Model alias", e.g. "TS0202"
  modelAlias?: string | null;
  functionality?: 'appliance' | 'climate' | 'energy' | 'ev_charger' | 'lighting' | 'media' | 'other' | 'power' | 'safety' | 'security' | 'shading'  | string | null,
  services?: Record<string, VinculumPd7Service> | null;
  type?: {
    // User-defined device type (e.g. "sensor", "chargepoint", or "light")
    type?: string | null;
    // User-defined device subtype (e.g. "presence" or "car_charger")
    subtype?: string | null;
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
