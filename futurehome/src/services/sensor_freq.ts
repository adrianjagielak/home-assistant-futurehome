import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { HaComponent } from "../ha/publish_device";

export function sensor_freq__components(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: HaComponent } {
  if (!svc.address) { return {}; }

  return {
    [svc.address]: {
      unique_id: svc.address,
      p: 'sensor',
      device_class: 'frequency',
      unit_of_measurement: svc.props?.sup_units?.[0] ?? 'Hz',
      value_template: `{{ value_json['${svc.address}'].sensor }}`,
    },
  };
}
