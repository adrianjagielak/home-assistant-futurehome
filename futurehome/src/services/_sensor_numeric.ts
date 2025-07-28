import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import {
  SensorDeviceClass,
  SensorStateClass,
} from '../ha/mqtt_components/_enums';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function _sensor_numeric__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  svcName: string,
): ServiceComponentsCreationResult | undefined {
  type SensorNumericDataTuple = [
    device_class: SensorDeviceClass | undefined,
    name: string | undefined,
    unit: string,
    state_class?: SensorStateClass,
  ];

  const data = (
    {
      sensor_accelx: [undefined, 'Acceleration, X-axis', 'm/s2'],
      sensor_accely: [undefined, 'Acceleration, Y-axis', 'm/s2'],
      sensor_accelz: [undefined, 'Acceleration, Z-axis', 'm/s2'],
      sensor_airflow: [undefined, 'Air flow', 'm3/h'],
      sensor_airq: ['aqi', undefined, 'pm25'],
      sensor_anglepos: [
        undefined,
        'Angle Position',
        '%',
        svc.props?.sup_units?.[0] === '%' ? 'measurement' : 'measurement_angle',
      ],
      sensor_atmo: ['atmospheric_pressure', undefined, 'kPa'],
      sensor_baro: ['atmospheric_pressure', undefined, 'kPa'],
      sensor_co: ['carbon_monoxide', undefined, 'mol/m3'],
      sensor_co2: ['carbon_dioxide', undefined, 'ppm'],
      sensor_current: ['current', undefined, 'A'],
      sensor_dew: ['temperature', 'Dew', '°C'],
      sensor_direct: ['wind_direction', 'Direction', '°'],
      sensor_distance: ['distance', undefined, 'm'],
      sensor_elresist: [undefined, 'Electrical resistivity', 'ohm/m'],
      sensor_freq: ['frequency', undefined, 'Hz'],
      sensor_gp: [undefined, 'Sensor', '%'],
      sensor_gust: [undefined, 'Gust', 'km/h'],
      sensor_humid: ['humidity', undefined, '%'],
      sensor_lumin: ['illuminance', undefined, 'lx'],
      sensor_moist: ['moisture', undefined, '%'],
      sensor_noise: ['sound_pressure', undefined, 'dB'],
      sensor_power: ['power', undefined, 'W'],
      sensor_rain: ['precipitation_intensity', undefined, 'mm/h'],
      sensor_rotation: [undefined, 'Rotation', 'rpm'],
      sensor_seismicint: [undefined, 'Seismic intensity', 'EMCRO'],
      sensor_seismicmag: [undefined, 'Seismic magnitude', 'MB'],
      sensor_solarrad: [undefined, 'Solar radiation', 'W/m2'],
      sensor_tank: ['volume_storage', undefined, 'l'],
      sensor_temp: ['temperature', undefined, '°C'],
      sensor_tidelvl: [undefined, 'Tide level', 'm'],
      sensor_uv: [undefined, 'Ultraviolet', 'index'],
      sensor_veloc: [undefined, 'Velocity', 'm/2'],
      sensor_voltage: ['voltage', undefined, 'V'],
      sensor_watflow: ['volume_flow_rate', 'Water flow', 'l/h'],
      sensor_watpressure: ['pressure', 'Water pressure', 'kPa'],
      sensor_wattemp: ['temperature', 'Water temperature', '°C'],
      sensor_weight: ['weight', undefined, 'kg'],
      sensor_wind: ['wind_speed', undefined, 'km/h'],
    } as Record<string, SensorNumericDataTuple>
  )[svcName];

  if (!data) return undefined;

  const device_class = data[0];
  const name = data[1];
  let unit = svc.props?.sup_units?.[0] ?? data[2];
  if (unit === 'C') unit = '°C';
  if (unit === 'F') unit = '°F';
  if (unit === 'kph') unit = 'km/h';
  const state_class = data[3];

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'sensor',
        name: name,
        device_class: device_class,
        state_class: state_class,
        unit_of_measurement: unit,
        value_template: `{{ value_json['${svc.addr}'].sensor }}`,
      },
    },
  };
}
