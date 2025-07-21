import { v4 as uuid } from "uuid";
import { connectHub, connectHA } from "./client";
import { publishDiscovery } from "./discovery";
import { exposeSmarthubTools } from "./admin";

(async () => {
  const hubIp       = process.env.FH_HUB_IP   || "";
  const hubUsername = process.env.FH_USERNAME || "";
  const hubPassword = process.env.FH_PASSWORD || "";

  const mqttHost     = process.env.MQTT_HOST || "";
  const mqttPort     = Number(process.env.MQTT_PORT || "1883");
  const mqttUsername = process.env.MQTT_USER || "";
  const mqttPassword = process.env.MQTT_PWD  || "";

  console.log("Debug: hub ip", hubIp)
  console.log("Debug: hub username", hubUsername)
  console.log("Debug: hub password", hubPassword)
  console.log("Debug: mqtt host", mqttHost)
  console.log("Debug: mqtt port", mqttPort)
  console.log("Debug: mqtt username", mqttUsername)
  console.log("Debug: mqtt password", mqttPassword)

  // 1) Connect to HA broker (for discovery + state)
  console.log("Connecting to HA broker...");
  const ha = await connectHA({ mqttHost, mqttPort, mqttUsername, mqttPassword, });
  console.log("Connected to HA broker");

  // 2) Connect to Futurehome hub (FIMP traffic)
  console.log("Connecting to Futurehome hub...");
  const fimp = await connectHub({ hubIp, username: hubUsername, password: hubPassword });
  console.log("Connected to Futurehome hub");

  exposeSmarthubTools(ha, fimp);

  // -- subscribe to FIMP events -----------------------------------------
  fimp.subscribe("#");
  fimp.on("message", (topic, buf) => {
    try {
      const msg = JSON.parse(buf.toString());
      console.debug("Received a FIMP message", topic);
      console.debug(JSON.stringify(msg, null, 0));
      if (msg.type === "evt.pd7.response") {
        const devices = msg.val?.param?.devices ?? [];
        devices.forEach((d: any) => publishDiscovery(ha, d));
      }
      // …forward state events as needed…
    } catch (e) {
      console.warn("Bad FIMP JSON", e, topic, buf);
    }
  });

  // -- ask hub for the device list --------------------------------------
  fimp.publish("pt:j1/mt:cmd/rt:app/rn:vinculum/ad:1", JSON.stringify({
    corid: null,
    ctime: new Date().toISOString(),
    props: {},
    resp_to: "pt:j1/mt:rsp/rt:app/rn:ha-futurehome/ad:addon",
    serv: "vinculum",
    src: 'smarthome-app',
    tags: [],
    type: "cmd.pd7.request",
    uid: uuid(),
    val: { cmd: "get", component: "state" },
    val_t: "object",
    ver: '1',
  }), { qos: 1 });
})();
