import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { HaComponent } from "../ha/publish_device";

export function sensor_contact__components(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: HaComponent } {
  if (!svc.address) { return {}; }

  return {
    [svc.address]: {
      unique_id: svc.address,
      p: 'binary_sensor',
      device_class: 'opening',
      value_template: `{{ value_json['${svc.address}'].open | iif('ON', 'OFF') }}`,
    },
  };
}
