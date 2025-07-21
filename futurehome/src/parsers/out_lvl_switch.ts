import { MqttClient } from 'mqtt';
import { v4 as uuid } from 'uuid';

export function handleLvlSwitch(client: MqttClient, dev: any, svc: any) {
  const uid = `fh_${dev.id}_${svc.name}`;
  const base = `homeassistant/light/${uid}`;

  client.publish(`${base}/config`, JSON.stringify({
    name: dev.name,
    uniq_id: uid,
    cmd_t: `${base}/set`,
    stat_t: `${base}/state`,
    bri_cmd_t: `${base}/brightness/set`,
    bri_stat_t: `${base}/brightness/state`,
    schema: "template",
    device: { identifiers: [dev.id.toString()], name: dev.name, model: dev.model }
  }), { retain: true });

  const bin = svc.attributes?.find((a: any) => a.name === 'binary')?.values?.[0]?.val;
  const lvl = svc.attributes?.find((a: any) => a.name === 'lvl')?.values?.[0]?.val;
  client.publish(`${base}/state`, bin ? "ON" : "OFF", { retain: true });
  if (lvl !== undefined) client.publish(`${base}/brightness/state`, String(lvl), { retain: true });

  client.subscribe([`${base}/set`, `${base}/brightness/set`]);

  client.on('message', (topic, payload) => {
    if (topic === `${base}/set`) {
      const on = payload.toString() === 'ON';
      client.publish(`pt:j1/mt:cmd/${svc.address}`, JSON.stringify({
        type: "cmd.binary.set",
        service: svc.name,
        uid: uuid(),
        val_t: "bool",
        val: on
      }), { qos: 1 });
    } else if (topic === `${base}/brightness/set`) {
      const value = parseInt(payload.toString(), 10);
      client.publish(`pt:j1/mt:cmd/${svc.address}`, JSON.stringify({
        type: "cmd.lvl.set",
        service: svc.name,
        uid: uuid(),
        val_t: "int",
        val: value
      }), { qos: 1 });
    }
  });
}
