import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { CMP } from "../ha/publish_device";

export function cmps_sensor_weight(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: CMP } {
  if (!svc.address) { return {}; }

  return {
    [svc.address]: {
      p: "sensor",
      device_class: "weigh",
      unit_of_measurement: svc.props?.sup_units?.[0] ?? "kg",
      value_template: `{{ value_json['${svc.address}'].sensor }}`,
      unique_id: svc.address,
    },
  };
}
