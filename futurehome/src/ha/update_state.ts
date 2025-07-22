import { DeviceState } from "../fimp/state";
import { log } from "../logger";
import { ha } from "./globals";

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
export function haUpdateState(parameters: { hubId: string, deviceState: DeviceState }) {
  const stateTopic = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.deviceState.id?.toString()}/state`

  const haState: { [addr: string]: { [attrName: string]: any } } = {};

  for (const service of parameters.deviceState.services || []) {
    if (!service.addr) { continue; }

    const serviceState: { [attrName: string]: any } = {};

    for (const attr of service.attributes || []) {
      const value = attr.values?.[0]?.val;
      serviceState[attr.name] = value;
    }

    haState[service.addr] = serviceState;
  }

  log.debug(`Publishing HA state "${stateTopic}"`)
  ha?.publish(stateTopic, JSON.stringify(haState), { retain: true, qos: 2 });
}
