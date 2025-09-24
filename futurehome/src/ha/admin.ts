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
import { pollVinculum } from '../fimp/vinculum';

const inclusionExclusionNotRunningValues = [
  'Ready',
  'Done',
  'Ready to start inclusion',
  'Failed trying to start inclusion.',
  "Operation failed. The device can't be included.",
  'Device added successfully!',
  'Ready to start exclusion',
  'Failed trying to start exclusion.',
  "Operation failed. The device can't be excluded.",
  '',
];

const inclusionExclusionStartingStoppingValues = [
  'Demo mode, inclusion not supported',
  'Demo mode, exclusion not supported',
  'Starting ZigBee inclusion',
  'Starting ZigBee exclusion',
  'Starting Z-Wave inclusion',
  'Starting Z-Wave exclusion',
  'Stopping',
];

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
    ha?.publish(`${topicPrefix}/inclusion_exclusion_status/state`, 'Ready', {
      retain: true,
      qos: 2,
    });
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
      [`${deviceId}_inclusion_exclusion_status`]: {
        unique_id: `${deviceId}_inclusion_exclusion_status`,
        platform: 'sensor',
        entity_category: 'diagnostic',
        device_class: 'enum',
        name: 'Inclusion/exclusion status',
        state_topic: `${topicPrefix}/inclusion_exclusion_status/state`,
      },
      [`${deviceId}_zwave_startExclusion`]: {
        unique_id: `${deviceId}_zwave_startExclusion`,
        platform: 'button',
        entity_category: 'diagnostic',
        name: 'Start Z-Wave exclusion',
        icon: 'mdi:z-wave',
        command_topic: `${topicPrefix}/start_exclusion/command`,
        payload_press: 'zwave',
        availability_topic: `${topicPrefix}/inclusion_exclusion_status/state`,
        availability_template: `{% if ${inclusionExclusionNotRunningValues.map((v) => `value == "${v}"`).join(' or ')} %}online{% else %}offline{% endif %}`,
      } as any,
      [`${deviceId}_zwave_startInclusion`]: {
        unique_id: `${deviceId}_zwave_startInclusion`,
        platform: 'button',
        entity_category: 'diagnostic',
        name: 'Start Z-Wave inclusion',
        icon: 'mdi:z-wave',
        command_topic: `${topicPrefix}/start_inclusion/command`,
        payload_press: 'zwave',
        availability_topic: `${topicPrefix}/inclusion_exclusion_status/state`,
        availability_template: `{% if ${inclusionExclusionNotRunningValues.map((v) => `value == "${v}"`).join(' or ')} %}online{% else %}offline{% endif %}`,
      } as any,
      [`${deviceId}_zigbee_startInclusion`]: {
        unique_id: `${deviceId}_zigbee_startInclusion`,
        platform: 'button',
        entity_category: 'diagnostic',
        name: 'Start ZigBee inclusion',
        icon: 'mdi:zigbee',
        command_topic: `${topicPrefix}/start_inclusion/command`,
        payload_press: 'zigbee',
        availability_topic: `${topicPrefix}/inclusion_exclusion_status/state`,
        availability_template: `{% if ${inclusionExclusionNotRunningValues.map((v) => `value == "${v}"`).join(' or ')} %}online{% else %}offline{% endif %}`,
      } as any,
      [`${deviceId}_stopInclusionExclusion`]: {
        unique_id: `${deviceId}_stopInclusionExclusion`,
        platform: 'button',
        entity_category: 'diagnostic',
        name: 'Stop inclusion/exclusion',
        icon: 'mdi:cancel',
        command_topic: `${topicPrefix}/stop_inclusion_exclusion/command`,
        availability_topic: `${topicPrefix}/inclusion_exclusion_status/state`,
        availability_template: `{% if ${[...inclusionExclusionNotRunningValues, ...inclusionExclusionStartingStoppingValues].map((v) => `value == "${v}"`).join(' or ')} %}offline{% else %}online{% endif %}`,
      } as any,
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
        ha?.publish(
          `${topicPrefix}/inclusion_exclusion_status/state`,
          'Demo mode, inclusion not supported',
          {
            retain: true,
            qos: 2,
          },
        );
        return;
      }

      ha?.publish(
        `${topicPrefix}/inclusion_exclusion_status/state`,
        payload == 'zwave'
          ? 'Starting Z-Wave inclusion'
          : 'Starting ZigBee inclusion',
        {
          retain: true,
          qos: 2,
        },
      );
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
        log.error('Failed trying to start inclusion', e);
        ha?.publish(
          `${topicPrefix}/inclusion_exclusion_status/state`,
          'Failed trying to start inclusion.',
          {
            retain: true,
            qos: 2,
          },
        );
      }
    },
    [`${topicPrefix}/stop_inclusion_exclusion/command`]: async (_payload) => {
      if (parameters.demoMode) {
        return;
      }

      ha?.publish(
        `${topicPrefix}/inclusion_exclusion_status/state`,
        'Stopping',
        {
          retain: true,
          qos: 2,
        },
      );

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
            {
              address: 'pt:j1/mt:cmd/rt:ad/rn:zigbee/ad:1',
              service: 'zigbee',
              cmd: 'cmd.thing.exclusion',
              val: false,
              val_t: 'bool',
            },
            {
              address: 'pt:j1/mt:cmd/rt:ad/rn:zw/ad:1',
              service: 'zwave-ad',
              cmd: 'cmd.thing.exclusion',
              val: false,
              val_t: 'bool',
            },
          ],
        );
        ha?.publish(`${topicPrefix}/inclusion_exclusion_status/state`, 'Done', {
          retain: true,
          qos: 2,
        });
      } catch (e) {
        log.error('Failed trying to stop inclusion/exclusion', e);
        ha?.publish(
          `${topicPrefix}/inclusion_exclusion_status/state`,
          'Failed trying to stop inclusion/exclusion.',
          {
            retain: true,
            qos: 2,
          },
        );
      }
    },
    [`${topicPrefix}/start_exclusion/command`]: async (payload) => {
      if (parameters.demoMode) {
        ha?.publish(
          `${topicPrefix}/inclusion_exclusion_status/state`,
          'Demo mode, exclusion not supported',
          {
            retain: true,
            qos: 2,
          },
        );
        return;
      }

      ha?.publish(
        `${topicPrefix}/inclusion_exclusion_status/state`,
        payload == 'zwave'
          ? 'Starting Z-Wave exclusion'
          : 'Starting ZigBee exclusion',
        {
          retain: true,
          qos: 2,
        },
      );
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
              cmd: 'cmd.thing.exclusion',
              val: true,
              val_t: 'bool',
            },
          ],
        );
      } catch (e) {
        log.error('Failed trying to start exclusion', e);
        ha?.publish(
          `${topicPrefix}/inclusion_exclusion_status/state`,
          'Failed trying to start exclusion.',
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
      break;
    case 'ADD_NODE_DONE':
      localizedStatus = 'Done';
      break;
    case 'NET_NODE_INCL_CTRL_OP_FAILED':
      localizedStatus = "Operation failed. The device can't be included.";
      break;
    default:
      localizedStatus = msg.val;
      log.warn(`Unknown inclusion status: ${msg.val}`);
      break;
  }

  ha?.publish(
    `${topicPrefix}/inclusion_exclusion_status/state`,
    localizedStatus,
    {
      retain: true,
      qos: 2,
    },
  );
}

export function handleExclusionStatusReport(hubId: string, msg: FimpResponse) {
  const topicPrefix = `homeassistant/device/futurehome_${hubId}_hub`;

  let localizedStatus: string;
  switch (msg.val) {
    case 'REMOVE_NODE_STARTING':
    case 'REMOVE_NODE_STARTED':
      localizedStatus = 'Looking for device in unpairing mode';
      break;
    case 'REMOVE_NODE_FOUND':
      localizedStatus = 'Device found';
      break;
    case 'REMOVE_NODE_DONE':
      localizedStatus = 'Done';
      break;
    case 'NET_NODE_REMOVE_FAILED':
      localizedStatus = "Operation failed. The device can't be excluded.";
      break;
    default:
      localizedStatus = msg.val;
      log.warn(`Unknown exclusion status: ${msg.val}`);
      break;
  }

  ha?.publish(
    `${topicPrefix}/inclusion_exclusion_status/state`,
    localizedStatus,
    {
      retain: true,
      qos: 2,
    },
  );
}

export async function handleInclusionReport(parameters: {
  hubId: string;
  demoMode: boolean;
  hubIp: string;
  thingsplexUsername: string;
  thingsplexPassword: string;
  thingsplexAllowEmpty: boolean;
}) {
  const topicPrefix = `homeassistant/device/futurehome_${parameters.hubId}_hub`;

  pollVinculum('device').catch((e) => log.warn('Failed to request devices', e));
  pollVinculum('state').catch((e) => log.warn('Failed to request state', e));

  if (parameters.demoMode) {
    ha?.publish(`${topicPrefix}/inclusion_exclusion_status/state`, 'Done', {
      retain: true,
      qos: 2,
    });
    return;
  }

  if (
    !parameters.thingsplexAllowEmpty &&
    !parameters.thingsplexUsername &&
    !parameters.thingsplexPassword
  ) {
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
    ha?.publish(`${topicPrefix}/inclusion_exclusion_status/state`, 'Done', {
      retain: true,
      qos: 2,
    });
  } catch (e) {
    log.error('Failed trying to stop inclusion/exclusion', e);
    ha?.publish(
      `${topicPrefix}/inclusion_exclusion_status/state`,
      'Failed trying to stop inclusion/exclusion.',
      {
        retain: true,
        qos: 2,
      },
    );
  }
}

export async function handleExclusionReport(parameters: {
  hubId: string;
  demoMode: boolean;
  hubIp: string;
  thingsplexUsername: string;
  thingsplexPassword: string;
  thingsplexAllowEmpty: boolean;
}) {
  const topicPrefix = `homeassistant/device/futurehome_${parameters.hubId}_hub`;

  pollVinculum('device').catch((e) => log.warn('Failed to request devices', e));
  pollVinculum('state').catch((e) => log.warn('Failed to request state', e));

  if (parameters.demoMode) {
    ha?.publish(`${topicPrefix}/inclusion_exclusion_status/state`, 'Done', {
      retain: true,
      qos: 2,
    });
    return;
  }

  if (
    !parameters.thingsplexAllowEmpty &&
    !parameters.thingsplexUsername &&
    !parameters.thingsplexPassword
  ) {
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
          cmd: 'cmd.thing.exclusion',
          val: false,
          val_t: 'bool',
        },
        {
          address: 'pt:j1/mt:cmd/rt:ad/rn:zw/ad:1',
          service: 'zwave-ad',
          cmd: 'cmd.thing.exclusion',
          val: false,
          val_t: 'bool',
        },
      ],
    );
    ha?.publish(`${topicPrefix}/inclusion_exclusion_status/state`, 'Done', {
      retain: true,
      qos: 2,
    });
  } catch (e) {
    log.error('Failed trying to stop inclusion/exclusion', e);
    ha?.publish(
      `${topicPrefix}/inclusion_exclusion_status/state`,
      'Failed trying to stop inclusion/exclusion.',
      {
        retain: true,
        qos: 2,
      },
    );
  }
}
