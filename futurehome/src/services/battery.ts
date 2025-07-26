import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function battery__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};

  if (svc.intf?.includes('evt.lvl.report')) {
    components[`${svc.addr}_lvl`] = {
      unique_id: `${svc.addr}_lvl`,
      platform: 'sensor',
      entity_category: 'diagnostic',
      device_class: 'battery',
      unit_of_measurement: svc.props?.sup_units?.[0] ?? '%',
      value_template: `{{ value_json['${svc.addr}'].lvl }}`,
    };
  } else if (svc.intf?.includes('evt.alarm.report')) {
    components[`${svc.addr}_alarm`] = {
      unique_id: `${svc.addr}_alarm`,
      platform: 'binary_sensor',
      entity_category: 'diagnostic',
      device_class: 'battery',
      value_template: `{{ (value_json['${svc.addr}'].alarm.status == 'activ') | iif('ON', 'OFF') }}`,
    };
  }

  return {
    components: components,
  };
}
