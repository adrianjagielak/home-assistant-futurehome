import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function battery__components(topicPrefix: string, vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): ServiceComponentsCreationResult {
  if (!svc.address) { return { components: {} }; }

  if (svc.props?.sup_events?.includes('low_battery')) {
    return {
      components: {
        [svc.address]: {
          unique_id: svc.address,
          p: 'binary_sensor',
          device_class: 'battery',
          value_template: `{{ (value_json['${svc.address}'].alarm.status == 'activ') | iif('ON', 'OFF') }}`,
        },
      },
    };
  }
  else {
    return {
      components: {
        [svc.address]: {
          unique_id: svc.address,
          p: 'sensor',
          device_class: 'battery',
          unit_of_measurement: svc.props?.sup_units?.[0] ?? '%',
          value_template: `{{ value_json['${svc.address}'].lvl }}`,
        },
      },
    };
  };
}
