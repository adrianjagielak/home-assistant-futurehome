import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function sensor_gust__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
): ServiceComponentsCreationResult | undefined {
  const device_class = undefined;
  const name = 'Gust';
  let unit = svc.props?.sup_units?.[0] ?? 'km/h';
  if (unit === 'kph') unit = 'km/h';

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'sensor',
        name: name,
        device_class: device_class,
        unit_of_measurement: unit,
        value_template: `{{ value_json['${svc.addr}'].sensor }}`,
      },
    },
  };
}
