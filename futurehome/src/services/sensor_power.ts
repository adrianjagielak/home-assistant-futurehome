import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function sensor_power__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
): ServiceComponentsCreationResult | undefined {
  const device_class = 'power';
  const unit = svc.props?.sup_units?.[0] ?? 'W';

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
