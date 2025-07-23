import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function sensor_co2__components(topicPrefix: string, vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): ServiceComponentsCreationResult {
  if (!svc.address) { return { components: {} }; }

  const device_class = 'carbon_dioxide';
  const unit = svc.props?.sup_units?.[0] ?? 'ppm';

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
