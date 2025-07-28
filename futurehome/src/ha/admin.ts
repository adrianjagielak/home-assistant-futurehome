import { v4 as uuidv4 } from 'uuid';
import { IMqttClient } from '../mqtt/interface';
import { CommandHandlers } from './publish_device';
import { HaDeviceConfig } from './ha_device_config';
import { ha } from './globals';
import { log } from '../logger';
import { abbreviateHaMqttKeys } from './abbreviate_ha_mqtt_keys';
import { FimpResponse } from '../fimp/fimp';
import {
  connectThingsplexWebSocketAndSend,
  loginToThingsplex,
} from '../thingsplex/thingsplex';
import { delay } from '../utils';
import { pollVinculum } from '../fimp/vinculum';

let initializedState = false;

export function exposeSmarthubTools(parameters: {
  hubId: string;
  demoMode: boolean;
  hubIp: string;
  thingsplexUsername: string;
  thingsplexPassword: string;
}): {
  commandHandlers: CommandHandlers;
} {
  // e.g. "homeassistant/device/futurehome_123456_hub"
  const topicPrefix = `homeassistant/device/futurehome_${parameters.hubId}_hub`;

  if (!initializedState) {
    ha?.publish(
      `${topicPrefix}/inclusion_status/state`,
      'Ready to start inclusion',
      {
        retain: true,
        qos: 2,
      },
    );
    initializedState = true;
  }

  const configTopic = `${topicPrefix}/config`;

  const deviceId = `futurehome_${parameters.hubId}_hub`;

  const config: HaDeviceConfig = {
    device: {
      identifiers: deviceId,
      name: 'Futurehome Smarthub',
      manufacturer: 'Futurehome',
      model: 'Smarthub',
      serial_number: parameters.hubId,
    },
    origin: {
      name: 'futurehome',
      support_url:
        'https://github.com/adrianjagielak/home-assistant-futurehome',
    },
    components: {
      [`${deviceId}_zwave_startInclusion`]: {
        unique_id: `${deviceId}_zwave_startInclusion`,
        platform: 'button',
        entity_category: 'diagnostic',
        name: 'Start Z-Wave inclusion',
        icon: 'mdi:z-wave',
        command_topic: `${topicPrefix}/start_inclusion/command`,
        payload_press: 'zwave',
        availability_topic: `${topicPrefix}/inclusion_status/state`,
        availability_template: `{% if value == "Done" or value == "Ready to start inclusion" or value == "Failed trying to start inclusion." or value == "Operation failed. The device can't be included." or value == "Device added successfully!" or value == "" %}online{% else %}offline{% endif %}`,
      } as any,
      [`${deviceId}_zigbee_startInclusion`]: {
        unique_id: `${deviceId}_zigbee_startInclusion`,
        platform: 'button',
        entity_category: 'diagnostic',
        name: 'Start ZigBee inclusion',
        icon: 'mdi:zigbee',
        command_topic: `${topicPrefix}/start_inclusion/command`,
        payload_press: 'zigbee',
        availability_topic: `${topicPrefix}/inclusion_status/state`,
        availability_template: `{% if value == "Done" or value == "Ready to start inclusion" or value == "Failed trying to start inclusion." or value == "Operation failed. The device can't be included." or value == "Device added successfully!" or value == "" %}online{% else %}offline{% endif %}`,
      } as any,
      [`${deviceId}_stopInclusion`]: {
        unique_id: `${deviceId}_stopInclusion`,
        platform: 'button',
        entity_category: 'diagnostic',
        name: 'Stop inclusion',
        icon: 'mdi:cancel',
        command_topic: `${topicPrefix}/stop_inclusion/command`,
        availability_topic: `${topicPrefix}/inclusion_status/state`,
        availability_template: `{% if value == "Done" or value == "Ready to start inclusion" or value == "Failed trying to start inclusion." or value == "Operation failed. The device can't be included." or value == "Device added successfully!" or value == "Starting" or value == "Stopping" or value == "" %}offline{% else %}online{% endif %}`,
      } as any,
      [`${deviceId}_inclusion_status`]: {
        unique_id: `${deviceId}_inclusion_status`,
        platform: 'sensor',
        entity_category: 'diagnostic',
        device_class: 'enum',
        name: 'Inclusion status',
        state_topic: `${topicPrefix}/inclusion_status/state`,
      },
    },
    qos: 2,
  };

  log.debug('Publishing Smarthub tools');
  ha?.publish(configTopic, JSON.stringify(abbreviateHaMqttKeys(config)), {
    retain: true,
    qos: 2,
  });

  const handlers: CommandHandlers = {
    [`${topicPrefix}/start_inclusion/command`]: async (payload) => {
      if (parameters.demoMode) {
        ha?.publish(`${topicPrefix}/inclusion_status/state`, 'Starting', {
          retain: true,
          qos: 2,
        });
        await delay(2000);
        ha?.publish(
          `${topicPrefix}/inclusion_status/state`,
          'Looking for device',
          {
            retain: true,
            qos: 2,
          },
        );
        await delay(2000);
        ha?.publish(
          `${topicPrefix}/inclusion_status/state`,
          'Demo mode, inclusion not supported',
          {
            retain: true,
            qos: 2,
          },
        );
        await delay(2000);
        ha?.publish(`${topicPrefix}/inclusion_status/state`, 'Done', {
          retain: true,
          qos: 2,
        });
        return;
      }

      ha?.publish(`${topicPrefix}/inclusion_status/state`, 'Starting', {
        retain: true,
        qos: 2,
      });
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
              address:
                payload == 'zwave'
                  ? 'pt:j1/mt:cmd/rt:ad/rn:zw/ad:1'
                  : 'pt:j1/mt:cmd/rt:ad/rn:zigbee/ad:1',
              service: payload == 'zwave' ? 'zwave-ad' : 'zigbee',
              cmd: 'cmd.thing.inclusion',
              val: true,
              val_t: 'bool',
            },
          ],
        );
      } catch (e) {
        ha?.publish(
          `${topicPrefix}/inclusion_status/state`,
          'Failed trying to start inclusion.',
          {
            retain: true,
            qos: 2,
          },
        );
      }
    },
    [`${topicPrefix}/stop_inclusion/command`]: async (_payload) => {
      ha?.publish(`${topicPrefix}/inclusion_status/state`, 'Stopping', {
        retain: true,
        qos: 2,
      });
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
              address: 'pt:j1/mt:cmd/rt:ad/rn:zigbee/ad:1',
              service: 'zigbee',
              cmd: 'cmd.thing.inclusion',
              val: false,
              val_t: 'bool',
            },
            {
              address: 'pt:j1/mt:cmd/rt:ad/rn:zw/ad:1',
              service: 'zwave-ad',
              cmd: 'cmd.thing.inclusion',
              val: false,
              val_t: 'bool',
            },
          ],
        );
        ha?.publish(`${topicPrefix}/inclusion_status/state`, 'Done', {
          retain: true,
          qos: 2,
        });
      } catch (e) {
        ha?.publish(
          `${topicPrefix}/inclusion_status/state`,
          'Failed trying to stop inclusion.',
          {
            retain: true,
            qos: 2,
          },
        );
      }
    },
  };

  return { commandHandlers: handlers };
}

export function handleInclusionStatusReport(hubId: string, msg: FimpResponse) {
  const topicPrefix = `homeassistant/device/futurehome_${hubId}_hub`;

  let localizedStatus: string;
  switch (msg.val) {
    case 'ADD_NODE_STARTING':
    case 'ADD_NODE_STARTED':
      localizedStatus = 'Looking for device';
      break;
    case 'ADD_NODE_ADDED':
    case 'ADD_NODE_GET_NODE_INFO':
    case 'ADD_NODE_PROTOCOL_DONE':
      localizedStatus = 'Device added successfully!';
      pollVinculum('device').catch((e) => log.warn('Failed to request devices', e));
      pollVinculum('state').catch((e) => log.warn('Failed to request state', e));
      break;
    case 'ADD_NODE_DONE':
      localizedStatus = 'Done';
      pollVinculum('device').catch((e) => log.warn('Failed to request devices', e));
      pollVinculum('state').catch((e) => log.warn('Failed to request state', e));
      break;
    case 'NET_NODE_INCL_CTRL_OP_FAILED':
      localizedStatus = "Operation failed. The device can't be included.";
      break;
    default:
      localizedStatus = msg.val;
      log.warn(`Unknown inclusion status: ${msg.val}`);
      break;
  }

  ha?.publish(`${topicPrefix}/inclusion_status/state`, localizedStatus, {
    retain: true,
    qos: 2,
  });
}

// todo exclusion?
// NET_NODE_REMOVE_FAILED", "Device can't be deleted
