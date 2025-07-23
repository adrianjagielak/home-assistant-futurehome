import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { HaComponent } from "../ha/publish_device";

export function battery__components(vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): { [key: string]: HaComponent } {
  if (!svc.address) { return {}; }

  if (svc.props?.sup_events?.includes('low_battery')) {
    return {
      [svc.address]: {
        p: "binary_sensor",
        device_class: "battery",
        value_template: `{{ value_json['${svc.address}'].alarm.status == 'activ' | iif('on', 'off') }}`,
        unique_id: svc.address,
      },
    };
  }
  else {
    return {
      [svc.address]: {
        p: "sensor",
        device_class: "battery",
        unit_of_measurement: svc.props?.sup_units?.[0] ?? "%",
        value_template: `{{ value_json['${svc.address}'].lvl }}`,
        unique_id: svc.address,
      },
    }
  };
}
