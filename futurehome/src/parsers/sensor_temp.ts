import { MqttClient } from 'mqtt';

export function handleTempSensor(client: MqttClient, dev: any, svc: any) {
  const uid = `fh_${dev.id}_${svc.name}`;
  const base = `homeassistant/sensor/${uid}`;

  client.publish(`${base}/config`, JSON.stringify({
    name: `${dev.name} Temperature`,
    uniq_id: uid,
    dev_cla: "temperature",
    stat_t: `${base}/state`,
    unit_of_meas: "℃",
    device: { identifiers: [dev.id.toString()], name: dev.name, model: dev.model }
  }), { retain: true });

  const temp = svc.attributes?.find((a: any) => a.name === 'sensor')?.values?.[0]?.val;
  if (temp !== undefined) {
    client.publish(`${base}/state`, String(temp), { retain: true });
  }
}
