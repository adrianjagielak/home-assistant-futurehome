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

const attributeTypeKeyMap: Record<string, string> = {
  alarm: 'event',
  meter: 'props.unit',
  meter_export: 'props.unit',
  param: 'parameter_id',
};

function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  return path
    .split('.')
    .reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function getTypeKey(attrName: string): string {
  return attributeTypeKeyMap[attrName] || 'type';
}

function extractTypeDiscriminator(
  entry: any,
  typeKeyPath: string,
): string | undefined {
  // Try to read the discriminator from the whole entry first (meter.props.unit),
  // then fall back to inside val (e.g. val.type)
  return (
    getNestedValue(entry, typeKeyPath) ?? getNestedValue(entry.val, typeKeyPath)
  );
}

/**
 * Helper function to process multiple values for an attribute, handling typed values
 */
function processAttributeValues(values: any[], attrName?: string): any {
  if (!values || values.length === 0) {
    return undefined;
  }

  // Special handling for "param" attributes
  if (attrName === 'param') {
    const paramMap: Record<string, any> = {};
    for (const entry of values) {
      if (entry.parameter_id) {
        paramMap[entry.parameter_id] = { ...entry };
      }
    }
    return paramMap;
  }

  // Sort by timestamp to get the latest values first (only if ts exists)
  const sortedValues = [...values].sort((a, b) => {
    const tsA = a.ts ? new Date(a.ts).getTime() : 0;
    const tsB = b.ts ? new Date(b.ts).getTime() : 0;
    return tsB - tsA; // Latest first
  });

  const typeKeyPath = getTypeKey(attrName || '');

  // Build list of entries that carry a discriminator
  const entriesWithType = sortedValues
    .map((v) => ({ v, key: extractTypeDiscriminator(v, typeKeyPath) }))
    .filter((x) => !!x.key) as Array<{ v: any; key: string }>;

  if (entriesWithType.length === 0) {
    // Not a typed attribute → just return latest value
    return sortedValues[0].val;
  }

  // Group by (normalized) discriminator, keeping only the latest per type
  const typeMap: Record<string, any> = {};

  for (const { v, key } of entriesWithType) {
    if (!typeMap[key]) {
      const payload =
        v && typeof v.val === 'object' && v.val !== null
          ? { ...v.val }
          : { val: v.val }; // wrap primitives like meter readings
      typeMap[key] = payload;
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
      const processedValue = processAttributeValues(
        attr.values || [],
        attr.name,
      );
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
  if (
    parameters.attrName === 'meter' ||
    parameters.attrName === 'meter_export'
  ) {
    // Ignore meter readings for now, relying on periodical site state updates
    return;
  }

  // Strip the FIMP envelope so we end up with "/rt:dev/…/ad:x_y"
  const addr = parameters.topic.replace(/^pt:j1\/mt:evt/, '');
  const typeKey = getTypeKey(parameters.attrName);

  for (const [stateTopic, payload] of Object.entries(haStateCache)) {
    if (!payload[addr]) continue;

    // Check if the new value has a type property
    if (
      parameters.value &&
      typeof parameters.value === 'object' &&
      getNestedValue(parameters.value, typeKey)
    ) {
      const key = getNestedValue(parameters.value, typeKey);
      const valueWithoutType =
        typeof parameters.value === 'object' && parameters.value !== null
          ? { ...parameters.value }
          : { val: parameters.value };

      const currentAttrValue = payload[addr][parameters.attrName];

      if (
        currentAttrValue &&
        typeof currentAttrValue === 'object' &&
        !Array.isArray(currentAttrValue)
      ) {
        // Current value is already a type map, update the specific type
        payload[addr][parameters.attrName] = {
          ...currentAttrValue,
          [key]: valueWithoutType,
        };
      } else {
        // Current value is not a type map, convert it to one
        payload[addr][parameters.attrName] = {
          [key]: valueWithoutType,
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
