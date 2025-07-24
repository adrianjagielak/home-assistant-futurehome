import { VinculumPd7Device, VinculumPd7Service } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function sensor_temp__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service
): ServiceComponentsCreationResult | undefined {
  const device_class = 'temperature'
  let unit = svc.props?.sup_units?.[0] ?? "°C";
  if (unit === 'C') unit = '°C';
  if (unit === 'F') unit = '°F';

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'sensor',
        device_class: device_class,
        unit_of_measurement: unit,
        value_template: `{{ value_json['${svc.addr}'].sensor }}`,
      },
    },
  };
}
