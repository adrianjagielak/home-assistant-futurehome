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
              "ts": "2025-07-22 16:21:31 +0200",
              "val": true,
              "val_t": "bool"
            },
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
    },
    {
      "addr": "/rt:dev/rn:hoiax/ad:1/sv:water_heater/ad:2",
      "attributes": [
        {
          "name": "state",
          "values": [
            {
              "ts": "2023-04-03 13:37:22 +0200",
              "val": "idle",
              "val_t": "string"
            }
          ]
        },
        {
          "name": "setpoint",
          "values": [
            {
              "ts": "2023-03-27 14:19:52 +0200",
              "val": {
                "temp": 49,
                "type": "vacation",
                "unit": "C"
              },
              "val_t": "object"
            },
            {
              "ts": "2023-03-27 14:19:52 +0200",
              "val": {
                "temp": 60,
                "type": "normal",
                "unit": "C"
              },
              "val_t": "object"
            },
            {
              "ts": "2023-12-21 09:44:28 +0100",
              "val": {
                "temp": 85.0,
                "type": "boost",
                "unit": "C"
              },
              "val_t": "object"
            },
            {
              "ts": "2023-03-27 14:19:52 +0200",
              "val": {
                "temp": 60,
                "type": "external",
                "unit": "C"
              },
              "val_t": "object"
            }
          ]
        },
        {
          "name": "mode",
          "values": [
            {
              "ts": "2023-04-05 16:08:43 +0200",
              "val": "off",
              "val_t": "string"
            }
          ]
        }
      ],
      "name": "water_heater"
    }
  ]
}
```

Saved state (assuming hub ID 123456):

```
topic: homeassistant/device/futurehome_123456_1/state
{
  "/rt:dev/rn:zigbee/ad:1/sv:sensor_presence/ad:1_1": {
    "presence": true
  },
  "/rt:dev/rn:zigbee/ad:1/sv:battery/ad:1_1": {
    "lvl": 1,
    "alarm": {
      "event": "low_battery",
      "status": "deactiv"
    }
  },
  "/rt:dev/rn:hoiax/ad:1/sv:water_heater/ad:2": {
    "state": "idle",
    "setpoint": {
      "vacation": {
        "temp": 49,
        "unit": "C"
      },
      "normal": {
        "temp": 60,
        "unit": "C"
      },
      "boost": {
        "temp": 85.0,
        "unit": "C"
      },
      "external": {
        "temp": 60,
        "unit": "C"
      }
    },
    "mode": "off"
  }
}
```
 */

const haStateCache: Record<
  string, // state topic
  Record<string, Record<string, any>> // payload (addr → { attr → value })
> = {};

/**
 * Helper function to process multiple values for an attribute, handling typed values
 */
function processAttributeValues(values: any[]): any {
  if (!values || values.length === 0) {
    return undefined;
  }

  // Sort by timestamp to get the latest values first
  const sortedValues = [...values].sort((a, b) => {
    const tsA = new Date(a.ts).getTime();
    const tsB = new Date(b.ts).getTime();
    return tsB - tsA; // Latest first
  });

  // Check if any value has a 'type' property in its val object
  const hasTypedValues = sortedValues.some(
    (v) => v.val && typeof v.val === 'object' && v.val.type,
  );

  if (!hasTypedValues) {
    // No typed values, return the latest value
    return sortedValues[0].val;
  }

  // Group by type, keeping only the latest value for each type
  const typeMap: Record<string, any> = {};

  for (const value of sortedValues) {
    if (value.val && typeof value.val === 'object' && value.val.type) {
      const type = value.val.type;
      if (!typeMap[type]) {
        // Create a copy without the 'type' property
        const { type: _, ...valueWithoutType } = value.val;
        typeMap[type] = valueWithoutType;
      }
    }
  }

  return typeMap;
}

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
      const processedValue = processAttributeValues(attr.values || []);
      if (processedValue !== undefined) {
        serviceState[attr.name] = processedValue;
      }
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
 * @param value    The new sensor reading (number, boolean, string, object with type, …)
 * @param attrName Attribute name to store the reading to
 *
 * The prefix "pt:j1/mt:evt" is removed before matching so that the remainder
 * exactly matches the address keys stored in the cached HA payloads.
 */
export function haUpdateStateValueReport(parameters: {
  topic: string;
  value: any;
  attrName: string;
}) {
  // Strip the FIMP envelope so we end up with "/rt:dev/…/ad:x_y"
  const addr = parameters.topic.replace(/^pt:j1\/mt:evt/, '');

  for (const [stateTopic, payload] of Object.entries(haStateCache)) {
    if (!payload[addr]) continue;

    // Check if the new value has a type property
    if (
      parameters.value &&
      typeof parameters.value === 'object' &&
      parameters.value.type
    ) {
      // Handle typed value update
      const type = parameters.value.type;
      const { type: _, ...valueWithoutType } = parameters.value;

      // Get current attribute value
      const currentAttrValue = payload[addr][parameters.attrName];

      if (
        currentAttrValue &&
        typeof currentAttrValue === 'object' &&
        !Array.isArray(currentAttrValue)
      ) {
        // Current value is already a type map, update the specific type
        payload[addr][parameters.attrName] = {
          ...currentAttrValue,
          [type]: valueWithoutType,
        };
      } else {
        // Current value is not a type map, convert it to one
        payload[addr][parameters.attrName] = {
          [type]: valueWithoutType,
        };
      }
    } else {
      // Handle regular value update (non-typed)
      payload[addr][parameters.attrName] = parameters.value;
    }

    log.debug(
      `Publishing updated state value for "${addr}" to "${stateTopic}"`,
    );
    ha?.publish(stateTopic, JSON.stringify(payload), { retain: true, qos: 2 });

    haStateCache[stateTopic] = payload;
  }
}

export function haGetCachedState(parameters: { topic: string }) {
  return haStateCache[parameters.topic];
}
