import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { HaComponent } from "../ha/publish_device";

export function sensor_gust__components(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: HaComponent } {
  if (!svc.address) { return {}; }

  let unit = svc.props?.sup_units?.[0] ?? "km/h";
  if (unit === 'kph') unit = 'km/h';

  return {
    [svc.address]: {
      unique_id: svc.address,
      p: 'sensor',
      unit_of_measurement: unit,
      value_template: `{{ value_json['${svc.address}'].sensor }}`,
    },
  };
}
