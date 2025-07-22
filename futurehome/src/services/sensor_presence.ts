import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { CMP } from "../ha/publish_device";

export function cmps_sensor_presence(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: CMP } {
  if (!svc.address) { return {}; }

  return {
    [svc.address]: {
      p: "binary_sensor",
      device_class: "presence",
      value_template: `{{ value_json['${svc.address}'].presence }}`,
      unique_id: svc.address,
    },
  };
}
