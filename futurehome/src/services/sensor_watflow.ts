import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function sensor_watflow__components(
  topicPrefix: string,
  vinculumDeviceData: VinculumPd7Device,
  svc: InclusionReportService
): ServiceComponentsCreationResult | undefined {
  if (!svc.address) { return; }

  const device_class = 'volume_flow_rate';
  const unit = svc.props?.sup_units?.[0] ?? 'l/h';

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
