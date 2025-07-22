import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { CMP } from "../ha/publish_device";

export function cmps_out_bin_switch(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: CMP } {
  if (!svc.address) { return {}; }

  return {
    // [svc.address]: {
    //   p: "sensor",
    //   device_class: "temperature",
    //   unit_of_measurement: "°C",
    //   value_template: `{{ value_json['${svc.address}'].sensor }}`,
    // },
  };
}
