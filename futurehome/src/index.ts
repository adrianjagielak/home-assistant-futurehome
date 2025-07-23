import { connectHub, connectHA, RetainedMessage } from "./client";
import { log } from "./logger";
import { FimpResponse, sendFimpMsg, setFimp } from "./fimp/fimp";
import { haCommandHandlers, setHa, setHaCommandHandlers } from "./ha/globals";
import { CommandHandlers, haPublishDevice } from "./ha/publish_device";
import { haUpdateState, haUpdateStateSensorReport } from "./ha/update_state";
import { VinculumPd7Device } from "./fimp/vinculum_pd7_device";
import { haUpdateAvailability } from "./ha/update_availability";
import { delay } from "./utils";

(async () => {
  const hubIp = process.env.FH_HUB_IP || "futurehome-smarthub.local";
  const hubUsername = process.env.FH_USERNAME || '';
  const hubPassword = process.env.FH_PASSWORD || '';
  const demoMode = (process.env.DEMO_MODE || '').toLowerCase().includes('true');

  const mqttHost = process.env.MQTT_HOST || '';
  const mqttPort = Number(process.env.MQTT_PORT || '1883');
  const mqttUsername = process.env.MQTT_USER || '';
  const mqttPassword = process.env.MQTT_PWD || '';

  // 1) Connect to HA broker (for discovery + state + availability + commands)
  log.info("Connecting to HA broker...");
  const { ha, retainedMessages } = await connectHA({ mqttHost, mqttPort, mqttUsername, mqttPassword, });
  setHa(ha);
  log.info("Connected to HA broker");

  if (!demoMode && (!hubUsername || !hubPassword)) {
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
  log.info("Connecting to Futurehome hub...");
  const fimp = await connectHub({ hubIp, username: hubUsername, password: hubPassword, demo: demoMode });
  fimp.subscribe("#");
  setFimp(fimp);
  log.info("Connected to Futurehome hub");

  const house = await sendFimpMsg({
    address: '/rt:app/rn:vinculum/ad:1',
    service: 'vinculum',
    cmd: 'cmd.pd7.request',
    val: { cmd: "get", component: null, param: { components: ['house'] } },
    val_t: 'object',
    timeoutMs: 30000,
  });
  const hubId = house.val.param.house.hubId;

  const devices = await sendFimpMsg({
    address: '/rt:app/rn:vinculum/ad:1',
    service: 'vinculum',
    cmd: 'cmd.pd7.request',
    val: { cmd: "get", component: null, param: { components: ['device'] } },
    val_t: 'object',
    timeoutMs: 30000,
  });

  const haConfig = retainedMessages.filter(msg => msg.topic.endsWith("/config"));

  const regex = new RegExp(`^homeassistant/device/futurehome_${hubId}_([a-zA-Z0-9]+)/config$`);
  for (const haDevice of haConfig) {
    log.debug('Found existing HA device', haDevice.topic)

    const match = haDevice.topic.match(regex);

    if (match) {
      const deviceId = match[1];
      const idNumber = Number(deviceId);

      if (!isNaN(idNumber)) {
        const basicDeviceData: { services?: { [key: string]: any } } = devices.val.param.device.find((d: any) => d?.id === idNumber);
        const firstServiceAddr = basicDeviceData?.services ? Object.values(basicDeviceData.services)[0]?.addr : undefined;;

        if (!basicDeviceData || !firstServiceAddr) {
          log.debug('Device was removed, removing from HA.');
          ha?.publish(haDevice.topic, '', { retain: true, qos: 2 });
          await delay(50);
        }
      } else if (deviceId.toLowerCase() === "hub") {
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

  const commandHandlers: CommandHandlers = {};
  for (const device of devices.val.param.device) {
    try {
      const vinculumDeviceData: VinculumPd7Device = device
      const deviceId = vinculumDeviceData.id.toString()
      const firstServiceAddr = vinculumDeviceData.services ? Object.values(vinculumDeviceData.services)[0]?.addr : undefined;;

      if (!firstServiceAddr) { continue; }

      // This is problematic when the adapter doesn't respond, so we are not getting the inclusion report for now. I'm leaving it here since we might want it in the future.
      // // Get additional metadata like manufacutrer or sw/hw version directly from the adapter
      // const adapterAddress = adapterAddressFromServiceAddress(firstServiceAddr)
      // const adapterService = adapterServiceFromServiceAddress(firstServiceAddr)
      // const deviceInclusionReport = await getInclusionReport({ adapterAddress, adapterService, deviceId });
      const deviceInclusionReport = undefined;

      const result = haPublishDevice({ hubId, vinculumDeviceData, deviceInclusionReport });
      await delay(50);

      Object.assign(commandHandlers, result.commandHandlers);

      if (!retainedMessages.some(msg => msg.topic === `homeassistant/device/futurehome_${hubId}_${deviceId}/availability`)) {
        // Set initial availability
        haUpdateAvailability({ hubId, deviceAvailability: { address: deviceId, status: 'UP' } });
        await delay(50);
      }
    } catch (e) {
      log.error('Failed publishing device', device, e);
    }
  }
  setHaCommandHandlers(commandHandlers);

  // todo
  // exposeSmarthubTools();

  fimp.on("message", async (topic, buf) => {
    try {
      const msg: FimpResponse = JSON.parse(buf.toString());
      log.debug(`Received FIMP message on topic "${topic}":\n${JSON.stringify(msg, null, 0)}`);

      switch (msg.type) {
        case 'evt.pd7.response': {
          const devicesState = msg.val?.param?.state?.devices;
          if (!devicesState) { return; }
          for (const deviceState of devicesState) {
            haUpdateState({ hubId, deviceState });
            await delay(50);
          }
          break;
        }
        case 'evt.sensor.report':
        case 'evt.presence.report':
        case 'evt.open.report':
        case 'evt.lvl.report':
        case 'evt.alarm.report':
        case 'evt.binary.report':
          {
            haUpdateStateSensorReport({ topic, value: msg.val, attrName: msg.type.split('.')[1] })
            break;
          }
        case 'evt.network.all_nodes_report': {
          const devicesAvailability = msg.val;
          if (!devicesAvailability) { return; }
          for (const deviceAvailability of devicesAvailability) {
            haUpdateAvailability({ hubId, deviceAvailability });
            await delay(50);
          }
          break;
        }
      }
    } catch (e) {
      log.warn("Bad FIMP JSON", e, topic, buf);
    }
  });

  const pollState = () => {
    sendFimpMsg({
      address: '/rt:app/rn:vinculum/ad:1',
      service: 'vinculum',
      cmd: 'cmd.pd7.request',
      val: { cmd: "get", component: null, param: { components: ['state'] } },
      val_t: 'object',
      timeoutMs: 30000,
    }).catch(e => log.warn("Failed to request state", e));
  };
  // Request initial state
  pollState();
  // Then poll every 30 seconds
  setInterval(pollState, 30000);

  ha.on('message', (topic, buf) => {
    // Handle Home Assistant command messages
    const handler = haCommandHandlers?.[topic];
    if (handler) {
      log.debug(`Handling Home Assistant command topic: ${topic}, payload: ${buf.toString()}`);
      handler(buf.toString()).catch((e) => {
        log.warn(`Failed executing handler for topic: ${topic}, payload: ${buf.toString()}`, e);
      });
    }
  })
})();
