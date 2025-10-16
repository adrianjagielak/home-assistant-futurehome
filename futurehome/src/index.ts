import { connectHub, connectHA, RetainedMessage } from './client';
import { log, setupLogger } from './logger';
import { FimpResponse, sendFimpMsg, setFimp } from './fimp/fimp';
import { haCommandHandlers, setHa, setHaCommandHandlers } from './ha/globals';
import { CommandHandlers, haPublishDevice } from './ha/publish_device';
import { haUpdateState, haUpdateStateValueReport } from './ha/update_state';
import { VinculumPd7Device } from './fimp/vinculum_pd7_device';
import { haUpdateAvailability } from './ha/update_availability';
import { delay } from './utils';
import {
  exposeSmarthubTools,
  handleExclusionReport,
  handleExclusionStatusReport,
  handleInclusionReport,
  handleInclusionStatusReport,
} from './ha/admin';
import { pollVinculum } from './fimp/vinculum';

(async () => {
  const hubIp = process.env.FH_HUB_IP || 'futurehome-smarthub.local';
  const localApiUsername = process.env.FH_USERNAME || '';
  const localApiPassword = process.env.FH_PASSWORD || '';
  const thingsplexUsername = process.env.TP_USERNAME || '';
  const thingsplexPassword = process.env.TP_PASSWORD || '';
  const thingsplexAllowEmpty = (process.env.TP_ALLOW_EMPTY || '')
    .toLowerCase()
    .includes('true');
  const ignoreAvailabilityReports = (
    process.env.IGNORE_AVAILABILITY_REPORTS || ''
  )
    .toLowerCase()
    .includes('true');
  const demoMode = (process.env.DEMO_MODE || '').toLowerCase().includes('true');
  const showDebugLog = (process.env.SHOW_DEBUG_LOG || '')
    .toLowerCase()
    .includes('true');

  const mqttHost = process.env.MQTT_HOST || '';
  const mqttPort = Number(process.env.MQTT_PORT || '1883');
  const mqttUsername = process.env.MQTT_USER || '';
  const mqttPassword = process.env.MQTT_PWD || '';

  setupLogger({ showDebugLog });

  // 1) Connect to HA broker (for discovery + state + availability + commands)
  log.info('Connecting to HA broker...');
  const { ha, retainedMessages } = await connectHA({
    mqttHost,
    mqttPort,
    mqttUsername,
    mqttPassword,
  });
  setHa(ha);
  log.info('Connected to HA broker');

  if (!demoMode && (!localApiUsername || !localApiPassword)) {
    log.info(
      'Empty username or password in non-demo mode. Removing all Futurehome devices from Home Assistant...',
    );

    const publishWithDelay = (messages: RetainedMessage[], index = 0) => {
      if (index >= messages.length) return;

      const msg = messages[index];
      ha?.publish(msg.topic, '', { retain: true, qos: 2 });

      setTimeout(() => publishWithDelay(messages, index + 1), 50); // 50 milliseconds between each publish
    };

    publishWithDelay(retainedMessages);
    return;
  }

  // 2) Connect to Futurehome hub (FIMP traffic)
  log.info('Connecting to Futurehome hub...');
  const fimp = await connectHub({
    hubIp,
    username: localApiUsername,
    password: localApiPassword,
    demo: demoMode,
  });
  fimp.subscribe('#');
  setFimp(fimp);
  log.info('Connected to Futurehome hub');

  const house = await pollVinculum('house');
  const hubId = house.val.param.house.hubId;

  const devices = await pollVinculum('device');
  log.debug(`FIMP devices:\n${JSON.stringify(devices, null, 0)}`);

  const haConfig = retainedMessages.filter((msg) =>
    msg.topic.endsWith('/config'),
  );

  const regex = new RegExp(
    `^homeassistant/device/futurehome_${hubId}_([a-zA-Z0-9]+)/config$`,
  );
  for (const haDevice of haConfig) {
    if (demoMode) {
      log.debug('Resetting all devices for demo mode');
      ha?.publish(haDevice.topic, '', { retain: true, qos: 2 });
      await delay(50);
      continue;
    }

    log.debug('Found existing HA device', haDevice.topic);

    const match = haDevice.topic.match(regex);

    if (match) {
      const deviceId = match[1];
      const idNumber = Number(deviceId);

      if (!isNaN(idNumber)) {
        const basicDeviceData: { services?: { [key: string]: any } } =
          devices.val.param.device.find((d: any) => d?.id === idNumber);
        const firstServiceAddr = basicDeviceData?.services
          ? Object.values(basicDeviceData.services)[0]?.addr
          : undefined;

        if (!basicDeviceData || !firstServiceAddr) {
          log.debug('Device was removed, removing from HA.');
          ha?.publish(haDevice.topic, '', { retain: true, qos: 2 });
          await delay(50);
        }
      } else if (deviceId.toLowerCase() === 'hub') {
        // Hub admin tools, ignore
      } else {
        log.debug('Invalid format, removing.');
        ha?.publish(haDevice.topic, '', { retain: true, qos: 2 });
        await delay(50);
      }
    } else {
      log.debug('Invalid format, removing.');
      ha?.publish(haDevice.topic, '', { retain: true, qos: 2 });
      await delay(50);
    }
  }

  if (demoMode) {
    // Wait for the devices to be fully removed from Home Assistant
    await delay(1000);
  }

  const vinculumDevicesToHa = async (devices: FimpResponse) => {
    const commandHandlers: CommandHandlers = {};
    for (const device of devices.val.param.device) {
      try {
        const vinculumDeviceData: VinculumPd7Device = device;
        const deviceId = vinculumDeviceData.id.toString();
        const firstServiceAddr = vinculumDeviceData.services
          ? Object.values(vinculumDeviceData.services)[0]?.addr
          : undefined;

        if (!firstServiceAddr) {
          continue;
        }

        // This is problematic when the adapter doesn't respond, so we are not getting the inclusion report for now. I'm leaving it here since we might want it in the future.
        // // Get additional metadata like manufacutrer or sw/hw version directly from the adapter
        // const adapterAddress = adapterAddressFromServiceAddress(firstServiceAddr)
        // const adapterService = adapterServiceFromServiceAddress(firstServiceAddr)
        // const deviceInclusionReport = await getInclusionReport({ adapterAddress, adapterService, deviceId });
        const deviceInclusionReport = undefined;

        const result = haPublishDevice({
          hubId,
          demoMode,
          hubIp,
          vinculumDeviceData,
          deviceInclusionReport,
          thingsplexUsername,
          thingsplexPassword,
          thingsplexAllowEmpty,
        });
        await delay(50);

        Object.assign(commandHandlers, result.commandHandlers);

        if (
          !retainedMessages.some(
            (msg) =>
              msg.topic ===
              `homeassistant/device/futurehome_${hubId}_${deviceId}/availability`,
          )
        ) {
          // Set initial availability
          haUpdateAvailability({
            hubId,
            deviceAvailability: { address: deviceId, status: 'UP' },
          });
          await delay(50);
        }
      } catch (e) {
        log.error('Failed publishing device', device, e);
      }
    }
    if (
      demoMode ||
      thingsplexAllowEmpty ||
      (thingsplexUsername && thingsplexPassword)
    ) {
      Object.assign(
        commandHandlers,
        exposeSmarthubTools({
          hubId,
          demoMode,
          hubIp,
          thingsplexUsername,
          thingsplexPassword,
        }).commandHandlers,
      );
    }
    setHaCommandHandlers(commandHandlers);
  };
  vinculumDevicesToHa(devices);

  let knownDeviceIds = new Set(devices.val.param.device.map((d: any) => d?.id));

  fimp.on('message', async (topic, buf) => {
    try {
      const msg: FimpResponse = JSON.parse(buf.toString());
      log.debug(
        `Received FIMP message on topic "${topic}":\n${JSON.stringify(msg, null, 0)}`,
      );

      switch (msg.type) {
        case 'evt.pd7.response': {
          // Handle vinculum 'state'
          const devicesState = msg.val?.param?.state?.devices;
          if (devicesState) {
            for (const deviceState of devicesState) {
              haUpdateState({ hubId, deviceState });
              await delay(50);
            }
          }

          // Handle vinculum 'device's
          const devices = msg.val.param.device;
          if (devices) {
            const newDeviceIds = new Set(devices.map((d: any) => d?.id));

            const addedDeviceIds = [...newDeviceIds].filter(
              (id) => !knownDeviceIds.has(id),
            );
            const removedDeviceIds = [...knownDeviceIds].filter(
              (id) => !newDeviceIds.has(id),
            );

            log.info(`Added devices: ${addedDeviceIds}`);
            log.info(`Removed devices: ${removedDeviceIds}`);

            for (const id of removedDeviceIds) {
              const topic = `homeassistant/device/futurehome_${hubId}_${id}/config`;
              ha?.publish(topic, '', { retain: true, qos: 2 });
              await delay(50);

              const availTopic = `homeassistant/device/futurehome_${hubId}_${id}/availability`;
              ha?.publish(availTopic, '', { retain: true, qos: 2 });
              await delay(50);
            }

            knownDeviceIds = newDeviceIds;

            vinculumDevicesToHa(msg);
          }
          break;
        }

        case 'evt.network.all_nodes_report': {
          const devicesAvailability = msg.val;
          if (!devicesAvailability) {
            return;
          }
          for (const deviceAvailability of devicesAvailability) {
            if (ignoreAvailabilityReports) {
              deviceAvailability.status = 'UP';
            }
            haUpdateAvailability({ hubId, deviceAvailability });
            await delay(50);
          }
          break;
        }

        case 'evt.thing.inclusion_status_report': {
          handleInclusionStatusReport(hubId, msg);
          break;
        }

        case 'evt.thing.exclusion_status_report': {
          handleExclusionStatusReport(hubId, msg);
          break;
        }

        case 'evt.thing.inclusion_report': {
          handleInclusionReport({
            hubId,
            demoMode,
            hubIp,
            thingsplexUsername,
            thingsplexPassword,
            thingsplexAllowEmpty,
          });
          break;
        }

        case 'evt.thing.exclusion_report': {
          handleExclusionReport({
            hubId,
            demoMode,
            hubIp,
            thingsplexUsername,
            thingsplexPassword,
            thingsplexAllowEmpty,
          });
          break;
        }

        default: {
          // Handle any event that matches the pattern: evt.<something>.report
          if (/^evt\..+\.report$/.test(msg.type ?? '')) {
            haUpdateStateValueReport({
              topic,
              value: msg.val,
              attrName: msg.type!.split('.')[1],
            });
          }
        }
      }
    } catch (e) {
      log.warn('Bad FIMP JSON', e, topic, buf);
    }
  });

  const pollState = () => {
    log.debug('Refreshing Vinculum state after 30 seconds...');

    pollVinculum('state').catch((e) => log.warn('Failed to request state', e));
  };
  // Request initial state
  pollState();
  // Then poll every 30 seconds
  if (!demoMode) {
    setInterval(pollState, 30 * 1000);
  }

  const pollDevices = () => {
    log.debug('Refreshing Vinculum devices after 30 minutes...');

    pollVinculum('device').catch((e) =>
      log.warn('Failed to request devices', e),
    );
  };
  // Poll devices every 30 minutes (1800000 ms)
  if (!demoMode) {
    setInterval(pollDevices, 30 * 60 * 1000);
  }

  ha.on('message', (topic, buf) => {
    // Handle Home Assistant command messages
    const handler = haCommandHandlers?.[topic];
    if (handler) {
      log.debug(
        `Handling Home Assistant command topic: ${topic}, payload: ${buf.toString()}`,
      );
      handler(buf.toString()).catch((e) => {
        log.warn(
          `Failed executing handler for topic: ${topic}, payload: ${buf.toString()}`,
          e,
        );
      });
    }
  });
})();
