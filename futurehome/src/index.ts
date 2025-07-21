import { connectHub, connectHA } from "./client";
import { publishDiscovery } from "./discovery";

(async () => {
  const hubIp   = process.env.FH_HUB_IP   || "";
  const user    = process.env.FH_USERNAME || "";
  const pass    = process.env.FH_PASSWORD || "";

  const mqttHost     = process.env.MQTT_HOST || "";
  const mqttPort     = Number(process.env.MQTT_PORT || "1883");
  const mqttUsername = process.env.MQTT_USER || "";
  const mqttPassword = process.env.MQTT_PWD  || "";


  // 1) Connect to HA broker (for discovery + state)
  const ha = await connectHA({ mqttHost, mqttPort, mqttUsername, mqttPassword, });

  // 2) Connect to Futurehome hub (FIMP traffic)
  const fimp = await connectHub({ hubIp, username: user, password: pass });

  // -- subscribe to FIMP events -----------------------------------------
  fimp.subscribe("#");
  fimp.on("message", (topic, buf) => {
    try {
      const msg = JSON.parse(buf.toString());
      if (msg.type === "evt.pd7.response") {
        const devices = msg.val?.param?.devices ?? [];
        devices.forEach((d: any) => publishDiscovery(ha, d));
      }
      // …forward state events as needed…
    } catch (e) {
      console.warn("Bad FIMP JSON", e);
    }
  });

  // -- ask hub for the device list --------------------------------------
  fimp.publish("pt:j1/mt:cmd/rt:app/rn:vinculum/ad:1", JSON.stringify({
    type: "cmd.pd7.request",
    service: "vinculum",
    uid: crypto.randomUUID(),
    val_t: "object",
    val: { cmd: "get", component: "state" },
    resp_to: "pt:j1/mt:rsp/rt:app/rn:ha-futurehome/ad:addon"
  }), { qos: 1 });
})();
