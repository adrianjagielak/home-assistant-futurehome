import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { CMP } from "../ha/publish_device";

export function cmps_sensor_contact(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: CMP } {
  if (!svc.address) { return {}; }

  return {
    [svc.address]: {
      p: "binary_sensor",
      device_class: "opening",
      value_template: `{{ value_json['${svc.address}'].open | iif('on', 'off') }}`,
      unique_id: svc.address,
    },
  };
}
