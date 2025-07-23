import { MqttClient } from 'mqtt';

export function handlePresenceSensor(client: MqttClient, dev: any, svc: any) {
  const uid = `fh_${dev.id}_${svc.name}`;
  const base = `homeassistant/sensor/${uid}`;

  client.publish(`${base}/config`, JSON.stringify({
    name: `${dev.name} Presence`,
    uniq_id: uid,
    dev_cla: "presence",
    stat_t: `${base}/state`,
    unit_of_meas: "°C",
    device: { identifiers: [dev.id.toString()], name: dev.name, model: dev.model }
  }), { retain: true });

  const presence = svc.attributes?.find((a: any) => a.name === 'presence')?.values?.[0]?.val;
  if (presence !== undefined) {
    client.publish(`${base}/state`, String(presence), { retain: true });
  }
}
