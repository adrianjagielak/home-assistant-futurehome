import { MqttClient } from 'mqtt';

export function handleBattery(client: MqttClient, dev: any, svc: any) {
  const uid = `fh_${dev.id}_${svc.name}`;
  const base = `homeassistant/sensor/${uid}`;

  // config
  client.publish(`${base}/config`, JSON.stringify({
    name: `${dev.name} Battery`,
    uniq_id: uid,
    dev_cla: "battery",
    stat_t: `${base}/state`,
    unit_of_meas: "%",
    device: { identifiers: [dev.id.toString()], name: dev.name, model: dev.model }
  }), { retain: true });

  // initial state if available
  const lvl = svc.attributes?.find((a: any) => a.name === 'lvl')?.values?.[0]?.val;
  if (lvl !== undefined) {
    client.publish(`${base}/state`, String(lvl), { retain: true });
  }
}
