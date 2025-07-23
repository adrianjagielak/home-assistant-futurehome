export type VinculumPd7Device = {
  client?: {
    // User-defined device name
    name?: string | null,
  } | null,
  id: number,
  services?: any,
  type?: {
    // User-defined device type (e.g. "sensor", "chargepoint", or "light")
    type?: string | null,
    // User-defined device subtype (e.g. "presence" or "car_charger")
    subtype?: string | null,
  } | null,
};
