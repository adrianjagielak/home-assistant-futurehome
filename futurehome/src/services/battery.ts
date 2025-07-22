import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { CMP } from "../ha/publish_device";

export function cmps_battery(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: CMP } {
  if (!svc.address) { return {}; }

  return {
    [svc.address]: {
      p: "sensor",
      device_class: "battery",
      unit_of_measurement: "%",
      value_template: `{{ value_json['${svc.address}'].lvl }}`,
      unique_id: svc.address,
    },
  };
}
