import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function sensor_gust__components(
  topicPrefix: string,
  vinculumDeviceData: VinculumPd7Device,
  svc: InclusionReportService
): ServiceComponentsCreationResult | undefined {
  if (!svc.address) { return; }

  const device_class = undefined;
  let unit = svc.props?.sup_units?.[0] ?? 'km/h';
  if (unit === 'kph') unit = 'km/h'

  return {
    components: {
      [svc.address]: {
        unique_id: svc.address,
        p: 'sensor',
        device_class: device_class,
        unit_of_measurement: unit,
        value_template: `{{ value_json['${svc.address}'].sensor }}`,
      },
    }
  };
}
