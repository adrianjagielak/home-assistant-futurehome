import { InclusionReport } from '../fimp/inclusion_report';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { log } from '../logger';
import { _alarm__components } from '../services/_alarm';
import { _meter__components } from '../services/_meter';
import { _sensor_binary__components } from '../services/_sensor_binary';
import { _sensor_numeric__components } from '../services/_sensor_numeric';
import { barrier_ctrl__components } from '../services/barrier_ctrl';
import { basic__components } from '../services/basic';
import { battery__components } from '../services/battery';
import { chargepoint__components } from '../services/chargepoint';
import { color_ctrl__components } from '../services/color_ctrl';
import { complex_alarm_system__components } from '../services/complex_alarm_system';
import { dev_sys__components } from '../services/dev_sys';
import { door_lock__components } from '../services/door_lock';
import { doorman__components } from '../services/doorman';
import { fan_ctrl__components } from '../services/fan_ctrl';
import { indicator_ctrl__components } from '../services/indicator_ctrl';
import { media_player__components } from '../services/media_player';
import { out_bin_switch__components } from '../services/out_bin_switch';
import { out_lvl_switch__components } from '../services/out_lvl_switch';
import { parameters__components } from '../services/parameters';
import { scene_ctrl__components } from '../services/scene_ctrl';
import { schedule_entry__components } from '../services/schedule_entry';
import { siren_ctrl__components } from '../services/siren_ctrl';
import { sound_switch__components } from '../services/sound_switch';
import { thermostat__components } from '../services/thermostat';
import { user_code__components } from '../services/user_code';
import { water_heater__components } from '../services/water_heater';
import {
  connectThingsplexWebSocketAndSend,
  loginToThingsplex,
} from '../thingsplex/thingsplex';
import { abbreviateHaMqttKeys } from './abbreviate_ha_mqtt_keys';
import { ha } from './globals';
import { HaDeviceConfig } from './ha_device_config';
import { HaMqttComponent } from './mqtt_components/_component';

export type ServiceComponentsCreationResult = {
  components: { [key: string]: HaMqttComponent };
  commandHandlers?: CommandHandlers;
};

export type CommandHandlers = {
  [topic: string]: (payload: string) => Promise<void>;
};

function ignoreService(
  _topicPrefix: string,
  _device: VinculumPd7Device,
  _svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  return undefined;
}

const serviceHandlers: {
  [name: string]: (
    topicPrefix: string,
    device: VinculumPd7Device,
    svc: VinculumPd7Service,
    svcName: string,
  ) => ServiceComponentsCreationResult | undefined;
} = {
  alarm_appliance: _alarm__components,
  alarm_burglar: _alarm__components,
  alarm_emergency: _alarm__components,
  alarm_fire: _alarm__components,
  alarm_gas: _alarm__components,
  alarm_health: _alarm__components,
  alarm_heat: _alarm__components,
  alarm_lock: _alarm__components,
  alarm_power: _alarm__components,
  alarm_siren: _alarm__components,
  alarm_system: _alarm__components,
  alarm_time: _alarm__components,
  alarm_water: _alarm__components,
  alarm_water_valve: _alarm__components,
  alarm_weather: _alarm__components,
  association: ignoreService,
  barrier_ctrl: barrier_ctrl__components,
  basic: basic__components,
  battery: battery__components,
  battery_charge_ctrl: ignoreService,
  chargepoint: chargepoint__components,
  color_ctrl: color_ctrl__components,
  complex_alarm_system: complex_alarm_system__components,
  dev_sys: dev_sys__components,
  diagnostic: ignoreService,
  door_lock: door_lock__components,
  doorman: doorman__components,
  fan_ctrl: fan_ctrl__components,
  indicator_ctrl: indicator_ctrl__components,
  inverter_consumer_conn: ignoreService,
  inverter_grid_conn: ignoreService,
  inverter_solar_conn: ignoreService,
  media_player: media_player__components,
  meter_cooling: _meter__components,
  meter_elec: _meter__components,
  meter_gas: _meter__components,
  meter_heating: _meter__components,
  meter_water: _meter__components,
  ota: ignoreService,
  out_bin_switch: out_bin_switch__components,
  out_lvl_switch: out_lvl_switch__components,
  parameters: parameters__components,
  power_regulator: ignoreService,
  scene_ctrl: scene_ctrl__components,
  schedule: ignoreService,
  schedule_entry: schedule_entry__components,
  sensor_accelx: _sensor_numeric__components,
  sensor_accely: _sensor_numeric__components,
  sensor_accelz: _sensor_numeric__components,
  sensor_airflow: _sensor_numeric__components,
  sensor_airq: _sensor_numeric__components,
  sensor_anglepos: _sensor_numeric__components,
  sensor_atmo: _sensor_numeric__components,
  sensor_baro: _sensor_numeric__components,
  sensor_co2: _sensor_numeric__components,
  sensor_co: _sensor_numeric__components,
  sensor_contact: _sensor_binary__components,
  sensor_current: _sensor_numeric__components,
  sensor_dew: _sensor_numeric__components,
  sensor_direct: _sensor_numeric__components,
  sensor_distance: _sensor_numeric__components,
  sensor_elresist: _sensor_numeric__components,
  sensor_freq: _sensor_numeric__components,
  sensor_gp: _sensor_numeric__components,
  sensor_gust: _sensor_numeric__components,
  sensor_humid: _sensor_numeric__components,
  sensor_lumin: _sensor_numeric__components,
  sensor_moist: _sensor_numeric__components,
  sensor_noise: _sensor_numeric__components,
  sensor_power: _sensor_numeric__components,
  sensor_presence: _sensor_binary__components,
  sensor_rain: _sensor_numeric__components,
  sensor_rotation: _sensor_numeric__components,
  sensor_seismicint: _sensor_numeric__components,
  sensor_seismicmag: _sensor_numeric__components,
  sensor_solarrad: _sensor_numeric__components,
  sensor_tank: _sensor_numeric__components,
  sensor_temp: _sensor_numeric__components,
  sensor_tidelvl: _sensor_numeric__components,
  sensor_uv: _sensor_numeric__components,
  sensor_veloc: _sensor_numeric__components,
  sensor_voltage: _sensor_numeric__components,
  sensor_watflow: _sensor_numeric__components,
  sensor_watpressure: _sensor_numeric__components,
  sensor_wattemp: _sensor_numeric__components,
  sensor_weight: _sensor_numeric__components,
  sensor_wind: _sensor_numeric__components,
  siren_ctrl: siren_ctrl__components,
  sound_switch: sound_switch__components,
  technology_specific: ignoreService,
  thermostat: thermostat__components,
  time: ignoreService,
  time_parameters: ignoreService,
  user_code: user_code__components,
  version: ignoreService,
  virtual_meter_elec: ignoreService,
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
  if (svcName === 'basic' && Object.entries(services).length > 1) {
    return false;
  }

  const exclusions = serviceExclusionMap[svcName];
  if (!exclusions) return true;

  return !exclusions.some((excludedService) => excludedService in services);
}

export function haPublishDevice(parameters: {
  hubId: string;
  demoMode: boolean;
  hubIp: string;
  vinculumDeviceData: VinculumPd7Device;
  deviceInclusionReport: InclusionReport | undefined;
  thingsplexUsername: string;
  thingsplexPassword: string;
  thingsplexAllowEmpty: boolean;
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

    const result = handler(
      topicPrefix,
      parameters.vinculumDeviceData,
      svc,
      svcName,
    );
    if (!result) {
      continue;
    }

    Object.assign(components, result.components);
    Object.assign(handlers, result.commandHandlers);
  }

  if (
    (parameters.thingsplexAllowEmpty ||
      (parameters.thingsplexUsername && parameters.thingsplexPassword)) &&
    parameters.vinculumDeviceData.fimp?.address &&
    parameters.vinculumDeviceData.fimp?.adapter
  ) {
    const deleteCommandTopic = `${topicPrefix}/delete/command`;

    const rawAdapterName = parameters.vinculumDeviceData.fimp?.adapter;

    let adapterName: string;
    switch (rawAdapterName) {
      case 'zigbee':
        adapterName = 'ZigBee';
        break;
      case 'zwave-ad':
        adapterName = 'Z-Wave';
        break;
      default:
        adapterName = rawAdapterName
          // Split the string by underscores
          .split('_')
          // Capitalize each word
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          // Join words with spaces
          .join(' ');
        break;
    }

    let adapterServiceAddr = `pt:j1/mt:evt/rt:ad/rn:${rawAdapterName}/ad:1`;
    if (rawAdapterName === 'zwave-ad') {
      adapterServiceAddr = 'pt:j1/mt:evt/rt:ad/rn:zw/ad:1';
    }

    components[`${topicPrefix}_delete_button`] = {
      unique_id: `${topicPrefix}_delete_button`,
      platform: 'button',
      entity_category: 'diagnostic',
      name: `${adapterName}: Unpair Device`,
      icon: 'mdi:delete-forever',
      command_topic: deleteCommandTopic,
    } as any;
    handlers[deleteCommandTopic] = async (_payload: string) => {
      if (parameters.demoMode) {
        return;
      }

      try {
        const token = await loginToThingsplex({
          host: parameters.hubIp,
          username: parameters.thingsplexUsername,
          password: parameters.thingsplexPassword,
        });
        await connectThingsplexWebSocketAndSend(
          {
            host: parameters.hubIp,
            token: token,
          },
          [
            {
              address: adapterServiceAddr,
              service: rawAdapterName,
              cmd: 'cmd.thing.delete',
              val_t: 'str_map',
              val: {
                address: parameters.vinculumDeviceData.fimp?.address,
              },
            },
          ],
        );
      } catch (e) {
        log.error('Failed to delete device:', e);
      }
    };
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
      identifiers: `futurehome_${parameters.hubId}_${parameters.vinculumDeviceData.id}`,
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
      via_device: `futurehome_${parameters.hubId}_hub`,
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
