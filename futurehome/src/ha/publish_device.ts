import { InclusionReport, InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { log } from "../logger";
import { cmps_battery } from "../services/battery";
import { cmps_out_bin_switch } from "../services/out_bin_switch";
import { cmps_out_lvl_switch } from "../services/out_lvl_switch";
import { cmps_sensor_presence } from "../services/sensor_presence";
import { cmps_sensor_temp } from "../services/sensor_temp";
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
  sensor_temp: cmps_sensor_temp,
  sensor_presence: cmps_sensor_presence,
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