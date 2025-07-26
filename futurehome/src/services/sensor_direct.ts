import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function sensor_direct__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const device_class = 'wind_direction';
  const name = undefined;
  const unit = svc.props?.sup_units?.[0] ?? '°';

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
