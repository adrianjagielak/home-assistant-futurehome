import { InclusionReport, InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { log } from "../logger";
import { cmps_battery } from "../services/battery";
import { cmps_out_bin_switch } from "../services/out_bin_switch";
import { cmps_out_lvl_switch } from "../services/out_lvl_switch";
import { cmps_sensor_accelx } from "../services/sensor_accelx";
import { cmps_sensor_accely } from "../services/sensor_accely";
import { cmps_sensor_accelz } from "../services/sensor_accelz";
import { cmps_sensor_airflow } from "../services/sensor_airflow";
import { cmps_sensor_airq } from "../services/sensor_airq";
import { cmps_sensor_anglepos } from "../services/sensor_anglepos";
import { cmps_sensor_atmo } from "../services/sensor_atmo";
import { cmps_sensor_baro } from "../services/sensor_baro";
import { cmps_sensor_co } from "../services/sensor_co";
import { cmps_sensor_co2 } from "../services/sensor_co2";
import { cmps_sensor_contact } from "../services/sensor_contact";
import { cmps_sensor_current } from "../services/sensor_current";
import { cmps_sensor_dew } from "../services/sensor_dew";
import { cmps_sensor_direct } from "../services/sensor_direct";
import { cmps_sensor_distance } from "../services/sensor_distance";
import { cmps_sensor_elresist } from "../services/sensor_elresist";
import { cmps_sensor_freq } from "../services/sensor_freq";
import { cmps_sensor_gp } from "../services/sensor_gp";
import { cmps_sensor_gust } from "../services/sensor_gust";
import { cmps_sensor_humid } from "../services/sensor_humid";
import { cmps_sensor_lumin } from "../services/sensor_lumin";
import { cmps_sensor_moist } from "../services/sensor_moist";
import { cmps_sensor_noise } from "../services/sensor_noise";
import { cmps_sensor_power } from "../services/sensor_power";
import { cmps_sensor_presence } from "../services/sensor_presence";
import { cmps_sensor_rain } from "../services/sensor_rain";
import { cmps_sensor_rotation } from "../services/sensor_rotation";
import { cmps_sensor_seismicint } from "../services/sensor_seismicint";
import { cmps_sensor_seismicmag } from "../services/sensor_seismicmag";
import { cmps_sensor_solarrad } from "../services/sensor_solarrad";
import { cmps_sensor_tank } from "../services/sensor_tank";
import { cmps_sensor_temp } from "../services/sensor_temp";
import { cmps_sensor_tidelvl } from "../services/sensor_tidelvl";
import { cmps_sensor_uv } from "../services/sensor_uv";
import { cmps_sensor_veloc } from "../services/sensor_veloc";
import { cmps_sensor_voltage } from "../services/sensor_voltage";
import { cmps_sensor_watflow } from "../services/sensor_watflow";
import { cmps_sensor_watpressure } from "../services/sensor_watpressure";
import { cmps_sensor_wattemp } from "../services/sensor_wattemp";
import { cmps_sensor_weight } from "../services/sensor_weight";
import { ha } from "./globals";

type HaDeviceConfig = {
  dev: {
    ids: string | null | undefined,
    name: string | null | undefined,
    mf: string | null | undefined,
    mdl: string | null | undefined,
    sw: string | null | undefined,
    sn: string | null | undefined,
    hw: string | null | undefined,
  };
  o: {
    name: 'futurehome',
    sw: '1.0',
    url: 'https://github.com/adrianjagielak/home-assistant-futurehome',
  };
  cmps: {
    [key: string]: CMP;
  },
  state_topic: string,
  availability_topic: string,
  qos: number,
}

export type CMP = {
  p: string;
  device_class?: string;
  unit_of_measurement?: string;
  value_template?: string;
  unique_id: string;
}

const serviceHandlers: {
  [name: string]: (vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService) => { [key: string]: CMP }
} = {
  battery: cmps_battery,
  out_bin_switch: cmps_out_bin_switch,
  out_lvl_switch: cmps_out_lvl_switch,
  sensor_accelx: cmps_sensor_accelx,
  sensor_accely: cmps_sensor_accely,
  sensor_accelz: cmps_sensor_accelz,
  sensor_airflow: cmps_sensor_airflow,
  sensor_airq: cmps_sensor_airq,
  sensor_anglepos: cmps_sensor_anglepos,
  sensor_atmo: cmps_sensor_atmo,
  sensor_baro: cmps_sensor_baro,
  sensor_co: cmps_sensor_co,
  sensor_co2: cmps_sensor_co2,
  sensor_contact: cmps_sensor_contact,
  sensor_current: cmps_sensor_current,
  sensor_dew: cmps_sensor_dew,
  sensor_direct: cmps_sensor_direct,
  sensor_distance: cmps_sensor_distance,
  sensor_elresist: cmps_sensor_elresist,
  sensor_freq: cmps_sensor_freq,
  sensor_gp: cmps_sensor_gp,
  sensor_gust: cmps_sensor_gust,
  sensor_humid: cmps_sensor_humid,
  sensor_lumin: cmps_sensor_lumin,
  sensor_moist: cmps_sensor_moist,
  sensor_noise: cmps_sensor_noise,
  sensor_power: cmps_sensor_power,
  sensor_presence: cmps_sensor_presence,
  sensor_rain: cmps_sensor_rain,
  sensor_rotation: cmps_sensor_rotation,
  sensor_seismicint: cmps_sensor_seismicint,
  sensor_seismicmag: cmps_sensor_seismicmag,
  sensor_solarrad: cmps_sensor_solarrad,
  sensor_tank: cmps_sensor_tank,
  sensor_temp: cmps_sensor_temp,
  sensor_tidelvl: cmps_sensor_tidelvl,
  sensor_uv: cmps_sensor_uv,
  sensor_veloc: cmps_sensor_veloc,
  sensor_voltage: cmps_sensor_voltage,
  sensor_watflow: cmps_sensor_watflow,
  sensor_watpressure: cmps_sensor_watpressure,
  sensor_wattemp: cmps_sensor_wattemp,
  sensor_weight: cmps_sensor_weight,
};

export function haPublishDevice(parameters: { hubId: string, vinculumDeviceData: VinculumPd7Device, deviceInclusionReport: InclusionReport }) {
  if (!parameters.deviceInclusionReport.services) {
    return;
  }

  let cmps: { [key: string]: CMP } = {};

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
      sw: '1.0',
      url: 'https://github.com/adrianjagielak/home-assistant-futurehome',
    },
    cmps: cmps,
    state_topic: stateTopic,
    availability_topic: availabilityTopic,
    qos: 2,
  };

  log.debug(`Publishing HA device "${configTopic}"`)
  ha?.publish(configTopic, JSON.stringify(config), { retain: true, qos: 2 });
}