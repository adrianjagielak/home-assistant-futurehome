import { InclusionReport, InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { log } from "../logger";
import { battery__components } from "../services/battery";
import { out_bin_switch__components } from "../services/out_bin_switch";
import { out_lvl_switch__components } from "../services/out_lvl_switch";
import { sensor_accelx__components } from "../services/sensor_accelx";
import { sensor_accely__components } from "../services/sensor_accely";
import { sensor_accelz__components } from "../services/sensor_accelz";
import { sensor_airflow__components } from "../services/sensor_airflow";
import { sensor_airq__components } from "../services/sensor_airq";
import { sensor_anglepos__components } from "../services/sensor_anglepos";
import { sensor_atmo__components } from "../services/sensor_atmo";
import { sensor_baro__components } from "../services/sensor_baro";
import { sensor_co__components } from "../services/sensor_co";
import { sensor_co2__components } from "../services/sensor_co2";
import { sensor_contact__components } from "../services/sensor_contact";
import { sensor_current__components } from "../services/sensor_current";
import { sensor_dew__components } from "../services/sensor_dew";
import { sensor_direct__components } from "../services/sensor_direct";
import { sensor_distance__components } from "../services/sensor_distance";
import { sensor_elresist__components } from "../services/sensor_elresist";
import { sensor_freq__components } from "../services/sensor_freq";
import { sensor_gp__components } from "../services/sensor_gp";
import { sensor_gust__components } from "../services/sensor_gust";
import { sensor_humid__components } from "../services/sensor_humid";
import { sensor_lumin__components } from "../services/sensor_lumin";
import { sensor_moist__components } from "../services/sensor_moist";
import { sensor_noise__components } from "../services/sensor_noise";
import { sensor_power__components } from "../services/sensor_power";
import { sensor_presence__components } from "../services/sensor_presence";
import { sensor_rain__components } from "../services/sensor_rain";
import { sensor_rotation__components } from "../services/sensor_rotation";
import { sensor_seismicint__components } from "../services/sensor_seismicint";
import { sensor_seismicmag__components } from "../services/sensor_seismicmag";
import { sensor_solarrad__components } from "../services/sensor_solarrad";
import { sensor_tank__components } from "../services/sensor_tank";
import { sensor_temp__components } from "../services/sensor_temp";
import { sensor_tidelvl__components } from "../services/sensor_tidelvl";
import { sensor_uv__components } from "../services/sensor_uv";
import { sensor_veloc__components } from "../services/sensor_veloc";
import { sensor_voltage__components } from "../services/sensor_voltage";
import { sensor_watflow__components } from "../services/sensor_watflow";
import { sensor_watpressure__components } from "../services/sensor_watpressure";
import { sensor_wattemp__components } from "../services/sensor_wattemp";
import { sensor_weight__components } from "../services/sensor_weight";
import { ha } from "./globals";

type HaDeviceConfig = {
  // device
  dev: {
    ids: string | null | undefined,
    name: string | null | undefined,
    // manufacturer
    mf: string | null | undefined,
    // model
    mdl: string | null | undefined,
    // software version
    sw: string | null | undefined,
    // serial number
    sn: string | null | undefined,
    // hardware number
    hw: string | null | undefined,
  };
  // origin
  o: {
    name: 'futurehome',
    url: 'https://github.com/adrianjagielak/home-assistant-futurehome',
  };
  // components
  cmps: {
    [key: string]: HaComponent;
  },
  // state topic
  stat_t: string,
  // availability topic
  avty_t: string,
  qos: number,
}

export type HaComponent = {
  // platform
  p: string;
  device_class?: string;
  unit_of_measurement?: string;
  value_template?: string;
  unique_id: string;
}

const serviceHandlers: {
  [name: string]: (vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService) => { [key: string]: HaComponent }
} = {
  battery: battery__components,
  out_bin_switch: out_bin_switch__components,
  out_lvl_switch: out_lvl_switch__components,
  sensor_accelx: sensor_accelx__components,
  sensor_accely: sensor_accely__components,
  sensor_accelz: sensor_accelz__components,
  sensor_airflow: sensor_airflow__components,
  sensor_airq: sensor_airq__components,
  sensor_anglepos: sensor_anglepos__components,
  sensor_atmo: sensor_atmo__components,
  sensor_baro: sensor_baro__components,
  sensor_co: sensor_co__components,
  sensor_co2: sensor_co2__components,
  sensor_contact: sensor_contact__components,
  sensor_current: sensor_current__components,
  sensor_dew: sensor_dew__components,
  sensor_direct: sensor_direct__components,
  sensor_distance: sensor_distance__components,
  sensor_elresist: sensor_elresist__components,
  sensor_freq: sensor_freq__components,
  sensor_gp: sensor_gp__components,
  sensor_gust: sensor_gust__components,
  sensor_humid: sensor_humid__components,
  sensor_lumin: sensor_lumin__components,
  sensor_moist: sensor_moist__components,
  sensor_noise: sensor_noise__components,
  sensor_power: sensor_power__components,
  sensor_presence: sensor_presence__components,
  sensor_rain: sensor_rain__components,
  sensor_rotation: sensor_rotation__components,
  sensor_seismicint: sensor_seismicint__components,
  sensor_seismicmag: sensor_seismicmag__components,
  sensor_solarrad: sensor_solarrad__components,
  sensor_tank: sensor_tank__components,
  sensor_temp: sensor_temp__components,
  sensor_tidelvl: sensor_tidelvl__components,
  sensor_uv: sensor_uv__components,
  sensor_veloc: sensor_veloc__components,
  sensor_voltage: sensor_voltage__components,
  sensor_watflow: sensor_watflow__components,
  sensor_watpressure: sensor_watpressure__components,
  sensor_wattemp: sensor_wattemp__components,
  sensor_weight: sensor_weight__components,
};

export function haPublishDevice(parameters: { hubId: string, vinculumDeviceData: VinculumPd7Device, deviceInclusionReport: InclusionReport }) {
  if (!parameters.deviceInclusionReport.services) {
    return;
  }

  let cmps: { [key: string]: HaComponent } = {};

  for (const svc of parameters.deviceInclusionReport.services) {
    if (!svc.name) { continue; }
    const handler = serviceHandlers[svc.name];
    if (handler) {
      const result = handler(parameters.vinculumDeviceData, svc);
      for (const key in result) {
        cmps[key] = result[key];
      }
    } else {
      log.error(`No handler for service: ${svc.name}`);
    }
  }

  //     "cmps": {
  //     "some_unique_component_id1": {
  //       "p": "sensor",
  //       "device_class":"temperature",
  //       "unit_of_measurement":"°C",
  //       "value_template":"{{ value_json.temperature }}",
  //       "unique_id":"temp01ae_t"
  //     },
  //     "some_unique_id2": {
  //       "p": "sensor",
  //       "device_class":"humidity",
  //       "unit_of_measurement":"%",
  //       "value_template":"{{ value_json.humidity }}",
  //       "unique_id":"temp01ae_h"
  //     },
  //     "bla1": {
  //       "p": "device_automation",
  //       "automation_type": "trigger",
  //       "payload": "short_press",
  //       "topic": "foobar/triggers/button1",
  //       "type": "button_short_press",
  //       "subtype": "button_1"
  //     },
  //     "bla2": {
  //       "p": "sensor",
  //       "state_topic": "foobar/sensor/sensor1",
  //       "unique_id": "bla_sensor001"
  //     }
  //   },

  const configTopic = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.deviceInclusionReport.address}/config`
  const stateTopic = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.deviceInclusionReport.address}/state`
  const availabilityTopic = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.deviceInclusionReport.address}/availability`
  const config: HaDeviceConfig = {
    dev: {
      ids: parameters.deviceInclusionReport.address,
      name:
        // User-defined device name
        parameters.vinculumDeviceData?.client?.name ??
        parameters.deviceInclusionReport.product_name,
      mf: parameters.deviceInclusionReport.manufacturer_id,
      mdl: parameters.deviceInclusionReport.product_id,
      sw: parameters.deviceInclusionReport.sw_ver,
      sn: parameters.deviceInclusionReport.product_hash,
      hw: parameters.deviceInclusionReport.hw_ver,
    },
    o: {
      name: 'futurehome',
      url: 'https://github.com/adrianjagielak/home-assistant-futurehome',
    },
    cmps: cmps,
    stat_t: stateTopic,
    avty_t: availabilityTopic,
    qos: 2,
  };

  log.debug(`Publishing HA device "${configTopic}"`)
  ha?.publish(configTopic, JSON.stringify(config), { retain: true, qos: 2 });
}