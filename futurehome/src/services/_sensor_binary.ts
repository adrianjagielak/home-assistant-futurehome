import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { BinarySensorDeviceClass } from '../ha/mqtt_components/_enums';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function _sensor_binary__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  svcName: string,
): ServiceComponentsCreationResult | undefined {
  const device_class = (
    {
      sensor_presence: 'occupancy',
      sensor_contact: 'opening',
    } as { [key: string]: BinarySensorDeviceClass }
  )[svcName];

  const value_field = (
    {
      sensor_presence: 'presence',
      sensor_contact: 'open',
    } as { [key: string]: string }
  )[svcName];

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'binary_sensor',
        device_class: device_class,
        value_template: `{{ value_json['${svc.addr}'].${value_field} | iif('ON', 'OFF') }}`,
      },
    },
  };
}
