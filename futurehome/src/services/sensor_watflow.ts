import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { CMP } from "../ha/publish_device";

export function cmps_sensor_watflow(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: CMP } {
  if (!svc.address) { return {}; }

  return {
    [svc.address]: {
      p: "sensor",
      device_class: "volume_flow_rate",
      unit_of_measurement: svc.props?.sup_units?.[0] ?? "l/h",
      value_template: `{{ value_json['${svc.address}'].sensor }}`,
      unique_id: svc.address,
    },
  };
}
