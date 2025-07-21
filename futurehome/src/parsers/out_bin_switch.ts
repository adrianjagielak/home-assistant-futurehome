import { MqttClient } from 'mqtt';
import { v4 as uuid } from 'uuid';

export function handleBinSwitch(client: MqttClient, dev: any, svc: any) {
  const uid = `fh_${dev.id}_${svc.name}`;
  const base = `homeassistant/switch/${uid}`;

  client.publish(`${base}/config`, JSON.stringify({
    name: dev.name,
    uniq_id: uid,
    cmd_t: `${base}/set`,
    stat_t: `${base}/state`,
    device: { identifiers: [dev.id.toString()], name: dev.name, model: dev.model }
  }), { retain: true });

  // current value
  const bin = svc.attributes?.find((a: any) => a.name === 'binary')?.values?.[0]?.val;
  client.publish(`${base}/state`, bin ? 'ON' : 'OFF', { retain: true });

  // HA → Smarthub
  client.subscribe(`${base}/set`, { qos: 0 });
  client.on('message', (topic, payload) => {
    if (topic !== `${base}/set`) return;
    const target = payload.toString() === 'ON';

    client.publish(`pt:j1/mt:cmd/${svc.address}`, JSON.stringify({
      type: "cmd.binary.set",
      service: svc.name,
      uid: uuid(),
      val_t: "bool",
      val: target,
      src: "ha-futurehome"
    }), { qos: 1 });
  });
}
