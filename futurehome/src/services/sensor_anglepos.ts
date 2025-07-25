import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function sensor_anglepos__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
): ServiceComponentsCreationResult | undefined {
  const device_class = undefined;
  const name = 'Angle Position';
  const unit = svc.props?.sup_units?.[0] ?? '%';
  const state_class = svc.props?.sup_units?.[0] === '%' ? 'measurement' : 'measurement_angle';

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'sensor',
        name: name,
        device_class: device_class,
        state_class: state_class,
        unit_of_measurement: unit,
        value_template: `{{ value_json['${svc.addr}'].sensor }}`,
      },
    },
  };
}
