import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { HaComponent } from "../ha/publish_device";

export function sensor_wattemp__components(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: HaComponent } {
  if (!svc.address) { return {}; }

  let unit = svc.props?.sup_units?.[0] ?? "℃";
  if (unit === 'C') unit = '℃';
  if (unit === 'F') unit = '℉';

  return {
    [svc.address]: {
      p: "sensor",
      device_class: "temperature",
      unit_of_measurement: unit,
      value_template: `{{ value_json['${svc.address}'].sensor }}`,
      unique_id: svc.address,
    },
  };
}
