import { connectHub, connectHA } from "./client";
import { exposeSmarthubTools } from "./admin";
import { log } from "./logger";
import { FimpResponse, sendFimpMsg, setFimp } from "./fimp/fimp";
import { getInclusionReport } from "./fimp/inclusion_report";
import { adapterAddressFromServiceAddress, adapterServiceFromServiceAddress } from "./fimp/helpers";
import { haCommandHandlers, setHa, setHaCommandHandlers } from "./ha/globals";
import { CommandHandlers, haPublishDevice } from "./ha/publish_device";
import { haUpdateState, haUpdateStateSensorReport } from "./ha/update_state";
import { VinculumPd7Device } from "./fimp/vinculum_pd7_device";
import { haUpdateAvailability } from "./ha/update_availability";

(async () => {
  const hubIp = process.env.FH_HUB_IP || "";
  const hubUsername = process.env.FH_USERNAME || "";
  const hubPassword = process.env.FH_PASSWORD || "";

  const mqttHost = process.env.MQTT_HOST || "";
  const mqttPort = Number(process.env.MQTT_PORT || "1883");
  const mqttUsername = process.env.MQTT_USER || "";
  const mqttPassword = process.env.MQTT_PWD || "";

  // 1) Connect to HA broker (for discovery + state)
  log.info("Connecting to HA broker...");
  const { ha, retainedMessages } = await connectHA({ mqttHost, mqttPort, mqttUsername, mqttPassword, });
  setHa(ha);
  log.info("Connected to HA broker");

  // 2) Connect to Futurehome hub (FIMP traffic)
  log.info("Connecting to Futurehome hub...");
  const fimp = await connectHub({ hubIp, username: hubUsername, password: hubPassword });
  fimp.subscribe("#");
  setFimp(fimp);
  log.info("Connected to Futurehome hub");

  let house = await sendFimpMsg({
    address: '/rt:app/rn:vinculum/ad:1',
    service: 'vinculum',
    cmd: 'cmd.pd7.request',
    val: { cmd: "get", component: null, param: { components: ['house'] } },
    val_t: 'object',
  });
  let hubId = house.val.param.house.hubId;

  let devices = await sendFimpMsg({
    address: '/rt:app/rn:vinculum/ad:1',
    service: 'vinculum',
    cmd: 'cmd.pd7.request',
    val: { cmd: "get", component: null, param: { components: ['device'] } },
    val_t: 'object',
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
        }
      } else if (deviceId.toLowerCase() === "hub") {
        // Hub admin tools, ignore
      } else {
        log.debug('Invalid format, removing.');
        ha?.publish(haDevice.topic, '', { retain: true, qos: 2 });
      }
    } else {
      log.debug('Invalid format, removing.');
      ha?.publish(haDevice.topic, '', { retain: true, qos: 2 });
    }
  }

  const commandHandlers: CommandHandlers = {};
  for (const device of devices.val.param.device) {
    const vinculumDeviceData: VinculumPd7Device = device
    const deviceId = vinculumDeviceData.id.toString()
    const services: { [key: string]: any } = vinculumDeviceData?.services
    const firstServiceAddr = services ? Object.values(services)[0]?.addr : undefined;;

    if (!firstServiceAddr) { continue; }

    const adapterAddress = adapterAddressFromServiceAddress(firstServiceAddr)
    const adapterService = adapterServiceFromServiceAddress(firstServiceAddr)

    // Get additional metadata like manufacutrer or sw/hw version directly from the adapter
    const deviceInclusionReport = await getInclusionReport({ adapterAddress, adapterService, deviceId });

    if (!retainedMessages.some(msg => msg.topic === `homeassistant/device/futurehome_${hubId}_${deviceId}/availability`)) {
      // Set initial availability
      haUpdateAvailability({ hubId, deviceAvailability: { address: deviceId, status: 'UP' } });
    }
    const result = haPublishDevice({ hubId, vinculumDeviceData, deviceInclusionReport });
    Object.assign(commandHandlers, result.commandHandlers);
  }
  setHaCommandHandlers(commandHandlers);

  // todo
  // exposeSmarthubTools();

  fimp.on("message", (topic, buf) => {
    try {
      const msg: FimpResponse = JSON.parse(buf.toString());
      log.debug(`Received FIMP message on topic "${topic}":\n${JSON.stringify(msg, null, 0)}`);

      switch (msg.type) {
        case 'evt.pd7.response': {
          const devicesState = msg.val?.param?.state?.devices;
          if (!devicesState) { return; }
          for (const deviceState of devicesState) {
            haUpdateState({ hubId, deviceState });
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
          }
          break;
        }
      }
    } catch (e) {
      log.warn("Bad FIMP JSON", e, topic, buf);
    }
  });

  // Request initial state
  await sendFimpMsg({
    address: '/rt:app/rn:vinculum/ad:1',
    service: 'vinculum',
    cmd: 'cmd.pd7.request',
    val: { cmd: "get", component: null, param: { components: ['state'] } },
    val_t: 'object',
  });

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
