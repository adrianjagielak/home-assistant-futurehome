import { InclusionReport } from '../fimp/inclusion_report';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { log } from '../logger';
import { barrier_ctrl__components } from '../services/barrier_ctrl';
import { basic__components } from '../services/basic';
import { battery__components } from '../services/battery';
import { chargepoint__components } from '../services/chargepoint';
import { color_ctrl__components } from '../services/color_ctrl';
import { fan_ctrl__components } from '../services/fan_ctrl';
import { indicator_ctrl__components } from '../services/indicator_ctrl';
import { media_player__components } from '../services/media_player';
import { out_bin_switch__components } from '../services/out_bin_switch';
import { out_lvl_switch__components } from '../services/out_lvl_switch';
import { scene_ctrl__components } from '../services/scene_ctrl';
import { sensor_accelx__components } from '../services/sensor_accelx';
import { sensor_accely__components } from '../services/sensor_accely';
import { sensor_accelz__components } from '../services/sensor_accelz';
import { sensor_airflow__components } from '../services/sensor_airflow';
import { sensor_airq__components } from '../services/sensor_airq';
import { sensor_anglepos__components } from '../services/sensor_anglepos';
import { sensor_atmo__components } from '../services/sensor_atmo';
import { sensor_baro__components } from '../services/sensor_baro';
import { sensor_co__components } from '../services/sensor_co';
import { sensor_co2__components } from '../services/sensor_co2';
import { sensor_contact__components } from '../services/sensor_contact';
import { sensor_current__components } from '../services/sensor_current';
import { sensor_dew__components } from '../services/sensor_dew';
import { sensor_direct__components } from '../services/sensor_direct';
import { sensor_distance__components } from '../services/sensor_distance';
import { sensor_elresist__components } from '../services/sensor_elresist';
import { sensor_freq__components } from '../services/sensor_freq';
import { sensor_gp__components } from '../services/sensor_gp';
import { sensor_gust__components } from '../services/sensor_gust';
import { sensor_humid__components } from '../services/sensor_humid';
import { sensor_lumin__components } from '../services/sensor_lumin';
import { sensor_moist__components } from '../services/sensor_moist';
import { sensor_noise__components } from '../services/sensor_noise';
import { sensor_power__components } from '../services/sensor_power';
import { sensor_presence__components } from '../services/sensor_presence';
import { sensor_rain__components } from '../services/sensor_rain';
import { sensor_rotation__components } from '../services/sensor_rotation';
import { sensor_seismicint__components } from '../services/sensor_seismicint';
import { sensor_seismicmag__components } from '../services/sensor_seismicmag';
import { sensor_solarrad__components } from '../services/sensor_solarrad';
import { sensor_tank__components } from '../services/sensor_tank';
import { sensor_temp__components } from '../services/sensor_temp';
import { sensor_tidelvl__components } from '../services/sensor_tidelvl';
import { sensor_uv__components } from '../services/sensor_uv';
import { sensor_veloc__components } from '../services/sensor_veloc';
import { sensor_voltage__components } from '../services/sensor_voltage';
import { sensor_watflow__components } from '../services/sensor_watflow';
import { sensor_watpressure__components } from '../services/sensor_watpressure';
import { sensor_wattemp__components } from '../services/sensor_wattemp';
import { sensor_weight__components } from '../services/sensor_weight';
import { sensor_wind__components } from '../services/sensor_wind';
import { thermostat__components } from '../services/thermostat';
import { water_heater__components } from '../services/water_heater';
import { abbreviateHaMqttKeys } from './abbreviate_ha_mqtt_keys';
import { ha } from './globals';
import { HaMqttComponent } from './mqtt_components/_component';

type HaDeviceConfig = {
  /**
   * Information about the device this sensor is a part of to tie it into the [device registry](https://developers.home-assistant.io/docs/device_registry_index/).
   * Only works when [`unique_id`](#unique_id) is set.
   * At least one of identifiers or connections must be present to identify the device.
   */
  device?: {
    /**
     * A link to the webpage that can manage the configuration of this device.
     * Can be either an `http://`, `https://` or an internal `homeassistant://` URL.
     */
    configuration_url?: string;

    /**
     * A list of connections of the device to the outside world as a list of tuples `[connection_type, connection_identifier]`.
     * For example the MAC address of a network interface:
     * `"connections": [["mac", "02:5b:26:a8:dc:12"]]`.
     */
    connections?: Array<[string, string]>;

    /**
     * The hardware version of the device.
     */
    hw_version?: string;

    /**
     * A list of IDs that uniquely identify the device.
     * For example a serial number.
     */
    identifiers?: string | string[];

    /**
     * The manufacturer of the device.
     */
    manufacturer?: string;

    /**
     * The model of the device.
     */
    model?: string;

    /**
     * The model identifier of the device.
     */
    model_id?: string;

    /**
     * The name of the device.
     */
    name?: string;

    /**
     * The serial number of the device.
     */
    serial_number?: string;

    /**
     * Suggest an area if the device isn’t in one yet.
     */
    suggested_area?: string;

    /**
     * The firmware version of the device.
     */
    sw_version?: string;

    /**
     * Identifier of a device that routes messages between this device and Home Assistant.
     * Examples of such devices are hubs, or parent devices of a sub-device.
     * This is used to show device topology in Home Assistant.
     */
    via_device?: string;
  };
  origin: {
    name: 'futurehome';
    support_url: 'https://github.com/adrianjagielak/home-assistant-futurehome';
  };
  components: {
    [key: string]: HaMqttComponent;
  };
  state_topic: string;
  availability_topic: string;
  qos: number;
};

export type ServiceComponentsCreationResult = {
  components: { [key: string]: HaMqttComponent };
  commandHandlers?: CommandHandlers;
};

export type CommandHandlers = {
  [topic: string]: (payload: string) => Promise<void>;
};

const serviceHandlers: {
  [name: string]: (
    topicPrefix: string,
    device: VinculumPd7Device,
    svc: VinculumPd7Service,
  ) => ServiceComponentsCreationResult | undefined;
} = {
  barrier_ctrl: barrier_ctrl__components,
  basic: basic__components,
  battery: battery__components,
  chargepoint: chargepoint__components,
  color_ctrl: color_ctrl__components,
  fan_ctrl: fan_ctrl__components,
  indicator_ctrl: indicator_ctrl__components,
  media_player: media_player__components,
  out_bin_switch: out_bin_switch__components,
  out_lvl_switch: out_lvl_switch__components,
  scene_ctrl: scene_ctrl__components,
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
  sensor_wind: sensor_wind__components,
  thermostat: thermostat__components,
  water_heater: water_heater__components,
};

// Defines service exclusions based on higher-level MQTT entity types.
// For example, if a device has a `thermostat` service, we skip `sensor_temp`
// because the thermostat component itself already reads and exposes the
// temperature internally. Similarly, `sensor_wattemp` is skipped when
// `water_heater` is present to avoid creating redundant entities.
const serviceExclusionMap: Record<string, string[]> = {
  sensor_temp: ['thermostat'],
  sensor_wattemp: ['water_heater'],
};

/**
 * Determines whether a given service should be published as a separate entity.
 *
 * Certain services (e.g., `sensor_temp`) are excluded when higher-level
 * services (e.g., `thermostat`) are present, because those higher-level
 * services already consume the lower-level state and expose it through
 * their own MQTT entities.
 *
 * @param svcName - The name of the service being evaluated.
 * @param services - A map of all services available for the device.
 * @returns `true` if the service should be published, `false` if it is excluded.
 */
function shouldPublishService(
  svcName: string,
  services: { [name: string]: VinculumPd7Service },
): boolean {
  const exclusions = serviceExclusionMap[svcName];
  if (!exclusions) return true;

  return !exclusions.some((excludedService) => excludedService in services);
}

export function haPublishDevice(parameters: {
  hubId: string;
  demoMode: boolean;
  vinculumDeviceData: VinculumPd7Device;
  deviceInclusionReport: InclusionReport | undefined;
}): { commandHandlers: CommandHandlers } {
  const components: { [key: string]: HaMqttComponent } = {};
  const handlers: CommandHandlers = {};

  // e.g. "homeassistant/device/futurehome_123456_1"
  const topicPrefix = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.vinculumDeviceData.id}`;

  for (const [svcName, svc] of Object.entries(
    parameters.vinculumDeviceData.services ?? {},
  )) {
    if (!svcName) {
      continue;
    }
    if (!svc.addr) {
      continue;
    }
    if (!svc.enabled) {
      continue;
    }
    // Skip publishing services that are already represented by higher-level MQTT entities
    if (
      !shouldPublishService(
        svcName,
        parameters.vinculumDeviceData.services ?? {},
      )
    ) {
      log.debug(
        `Skipping service ${svcName} because a higher-level service handles its data`,
      );
      continue;
    }

    const handler = serviceHandlers[svcName];
    if (!handler) {
      log.error(`No handler for service: ${svcName}`);
      continue;
    }

    const result = handler(topicPrefix, parameters.vinculumDeviceData, svc);
    if (!result) {
      log.error(
        `Invalid service data prevented component creation: ${parameters.vinculumDeviceData} ${svc}`,
      );
      continue;
    }

    Object.assign(components, result.components);
    Object.assign(handlers, result.commandHandlers);
  }

  let vinculumManufacturer: string | undefined;
  const parts = (parameters.vinculumDeviceData?.model ?? '').split(' - ');
  if (parts.length === 3) {
    vinculumManufacturer = parts[1];
  }

  const configTopic = `${topicPrefix}/config`;
  const stateTopic = `${topicPrefix}/state`;
  const availabilityTopic = `${topicPrefix}/availability`;
  const config: HaDeviceConfig = {
    device: {
      identifiers: parameters.vinculumDeviceData.id.toString(),
      name:
        parameters.vinculumDeviceData?.client?.name ??
        parameters.vinculumDeviceData?.modelAlias ??
        parameters.deviceInclusionReport?.product_name ??
        undefined,
      manufacturer:
        vinculumManufacturer ??
        parameters.deviceInclusionReport?.manufacturer_id ??
        undefined,
      model:
        parameters.vinculumDeviceData?.modelAlias ??
        parameters.deviceInclusionReport?.product_id ??
        undefined,
      sw_version: parameters.deviceInclusionReport?.sw_ver ?? undefined,
      serial_number:
        parameters.deviceInclusionReport?.product_hash ?? undefined,
      hw_version: parameters.deviceInclusionReport?.hw_ver ?? undefined,
      via_device: 'todo_hub_id',
    },
    origin: {
      name: 'futurehome',
      support_url:
        'https://github.com/adrianjagielak/home-assistant-futurehome',
    },
    components: components,
    state_topic: stateTopic,
    availability_topic: availabilityTopic,
    qos: 2,
  };

  log.debug(`Publishing HA device "${configTopic}"`);
  ha?.publish(configTopic, JSON.stringify(abbreviateHaMqttKeys(config)), {
    retain: true,
    qos: 2,
  });

  return { commandHandlers: handlers };
}
