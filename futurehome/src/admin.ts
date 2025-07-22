import { MqttClient } from "mqtt";
import { v4 as uuidv4 } from "uuid";

export function exposeSmarthubTools(
  ha: MqttClient,
  fimp: MqttClient,
  hubAddr = "pt:j1/mt:cmd/rt:app/rn:zb/ad:1"
) {
  const base = "homeassistant/switch/fh_zb_pairing";
  const device = {
    identifiers: ["futurehome_hub"],
    name: "Futurehome Hub",
    model: "Smarthub",
  };

  ha.publish(
    `${base}/config`,
    JSON.stringify({
      name: "Zigbee Pairing",
      uniq_id: "fh_zb_pairing",
      cmd_t: `${base}/set`,
      stat_t: `${base}/state`,
      device,
    }),
    { retain: true }
  );

  //   // keep last known state locally
  //   let pairingOn = false;

  ha.subscribe(`${base}/set`);
  ha.on("message", (topic, payload) => {
    if (topic !== `${base}/set`) return;
    const turnOn = payload.toString() === "ON";

    // // optimistic update so the UI flips instantly
    // pairingOn = turnOn;
    ha.publish(`${base}/state`, turnOn ? "ON" : "OFF", { retain: true });

    // placeholder FIMP message – adjust to real API if different
    fimp.publish(
      hubAddr,
      JSON.stringify({
        type: "cmd.pairing_mode.set",
        service: "zigbee",
        uid: uuidv4(),
        val_t: "str",
        val: turnOn ? "start" : "stop",
      }),
      { qos: 1 }
    );
  });

  // (optional) listen for hub-side confirmation and correct state here
}
