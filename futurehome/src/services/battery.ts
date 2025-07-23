import { VinculumPd7Device, VinculumPd7Service } from "../fimp/vinculum_pd7_device";
import { HaComponent, ServiceComponentsCreationResult } from "../ha/publish_device";

export function battery__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaComponent> = {};

  if (svc.intf?.includes('evt.alarm.report')) {
    components[`${svc.addr}_alarm`] = {
      unique_id: `${svc.addr}_alarm`,
      p: 'binary_sensor',
      device_class: 'battery',
      value_template: `{{ (value_json['${svc.addr}'].alarm.status == 'activ') | iif('ON', 'OFF') }}`,
    };
  }

  if (svc.intf?.includes('evt.lvl.report')) {
    components[`${svc.addr}_lvl`] = {
      unique_id: `${svc.addr}_lvl`,
      p: 'sensor',
      device_class: 'battery',
      unit_of_measurement: svc.props?.sup_units?.[0] ?? '%',
      value_template: `{{ value_json['${svc.addr}'].lvl }}`,
    };
  }

  return {
    components: components,
  };
}
