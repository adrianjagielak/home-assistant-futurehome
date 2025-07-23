import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function sensor_presence__components(topicPrefix: string, vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): ServiceComponentsCreationResult {
  if (!svc.address) { return { components: {} }; }

  const device_class = 'occupancy'

  return {
    components: {
      [svc.address]: {
        unique_id: svc.address,
        p: 'binary_sensor',
        device_class: device_class,
        value_template: `{{ value_json['${svc.address}'].presence | iif('ON', 'OFF') }}`,
      },
    },
  };
}
