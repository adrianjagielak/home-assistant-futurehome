import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function sensor_contact__components(topicPrefix: string, vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): ServiceComponentsCreationResult {
  if (!svc.address) { return { components: {} }; }

  const device_class = 'opening'

  return {
    components: {
      [svc.address]: {
        unique_id: svc.address,
        p: 'binary_sensor',
        device_class: device_class,
        value_template: `{{ value_json['${svc.address}'].open | iif('ON', 'OFF') }}`,
      },
    },
  };
}
