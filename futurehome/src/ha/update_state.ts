import { DeviceState } from '../fimp/state';
import { log } from '../logger';
import { ha } from './globals';

/**
 * Example raw FIMP state input:
```json
{
  "id": 1,
  "services": [
    {
      "addr": "/rt:dev/rn:zigbee/ad:1/sv:sensor_presence/ad:1_1",
      "attributes": [
        {
          "name": "presence",
          "values": [
            {
              "ts": "2025-07-22 16:21:30 +0200",
              "val": false,
              "val_t": "bool"
            }
          ]
        }
      ],
      "name": "sensor_presence"
    },
    {
      "addr": "/rt:dev/rn:zigbee/ad:1/sv:battery/ad:1_1",
      "attributes": [
        {
          "name": "lvl",
          "values": [
            {
              "ts": "2025-07-19 00:43:30 +0200",
              "val": 1,
              "val_t": "int"
            }
          ]
        },
        {
          "name": "alarm",
          "values": [
            {
              "ts": "2025-07-22 16:21:30 +0200",
              "val": {
                "event": "low_battery",
                "status": "deactiv"
              },
              "val_t": "str_map"
            }
          ]
        }
      ],
      "name": "battery"
    }
  ]
}
```

Output (assuming hub ID 123456):

```
topic: homeassistant/device/futurehome_123456_1/state
{
  "/rt:dev/rn:zigbee/ad:1/sv:sensor_presence/ad:1_1": {
    "presence": false
  },
  "/rt:dev/rn:zigbee/ad:1/sv:battery/ad:1_1": {
    "lvl": 1,
    "alarm": {
      "event": "low_battery",
      "status": "deactiv"
    }
  }
}
```
 */

const haStateCache: Record<
  string, // state topic
  Record<string, Record<string, any>> // payload (addr → { attr → value })
> = {};

/**
 * Publishes the full state of a Futurehome device to Home Assistant and
 * stores a copy in the private cache above.
 *
 * Example MQTT topic produced for hub 123456 and device id 1:
 *   homeassistant/device/futurehome_123456_1/state
 */
export function haUpdateState(parameters: {
  hubId: string;
  deviceState: DeviceState;
}) {
  const stateTopic = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.deviceState.id?.toString()}/state`;

  const haState: Record<string, Record<string, any>> = {};

  for (const service of parameters.deviceState.services || []) {
    if (!service.addr) continue;

    const serviceState: Record<string, any> = {};

    for (const attr of service.attributes || []) {
      const value = attr.values?.[0]?.val;
      serviceState[attr.name] = value;
    }

    haState[service.addr] = serviceState;
  }

  log.debug(`Publishing HA state "${stateTopic}"`);
  ha?.publish(stateTopic, JSON.stringify(haState), { retain: true, qos: 2 });

  // ---- cache state for later incremental updates ----
  haStateCache[stateTopic] = haState;
}

/**
 * Incrementally updates a single sensor value inside cached state payload
 * that references the given device‑service address and republishes
 * the modified payload(s).
 *
 * @param topic    Full FIMP event topic, e.g.
 *                 "pt:j1/mt:evt/rt:dev/rn:zigbee/ad:1/sv:sensor_temp/ad:3_1"
 * @param value    The new sensor reading (number, boolean, string, …)
 * @param attrName Attribute name to store the reading to
 *
 * The prefix "pt:j1/mt:evt" is removed before matching so that the remainder
 * exactly matches the address keys stored in the cached HA payloads.
 */
export function haUpdateStateSensorReport(parameters: {
  topic: string;
  value: any;
  attrName: string;
}) {
  // Strip the FIMP envelope so we end up with "/rt:dev/…/ad:x_y"
  const sensorAddr = parameters.topic.replace(/^pt:j1\/mt:evt/, '');

  for (const [stateTopic, payload] of Object.entries(haStateCache)) {
    if (!payload[sensorAddr]) continue;

    // Update the reading in‑place
    payload[sensorAddr][parameters.attrName] = parameters.value;

    log.debug(
      `Publishing updated sensor value for "${sensorAddr}" to "${stateTopic}"`,
    );
    ha?.publish(stateTopic, JSON.stringify(payload), { retain: true, qos: 2 });

    haStateCache[stateTopic] = payload;
  }
}

export function haGetCachedState(parameters: { topic: string }) {
  return haStateCache[parameters.topic];
}
