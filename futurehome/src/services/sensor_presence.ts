import { VinculumPd7Device, VinculumPd7Service } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function sensor_presence__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service
): ServiceComponentsCreationResult | undefined {
  const device_class = 'occupancy'

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        p: 'binary_sensor',
        device_class: device_class,
        value_template: `{{ value_json['${svc.addr}'].presence | iif('ON', 'OFF') }}`,
      },
    },
  };
}
