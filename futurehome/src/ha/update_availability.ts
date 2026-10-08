import { log } from '../logger';
import { ha } from './globals';
import { VinculumPd7Device } from '../fimp/vinculum_pd7_device';

/**
 * Example raw FIMP availaility (from evt.network.all_nodes_report on topic
 * `pt:j1/mt:evt/rt:ad/rn:zw/ad:1`) input:
```json
{
  "address": "27",
  "hash": "zw_270_9_1",
  "power_source": "battery",
  "status": "UP"
}
```

`address` is the node address within the adapter (e.g. the Z-Wave node ID),
not the vinculum device ID, so it has to be mapped to the device(s) using
`fimp.adapter` + `fimp.address` from the vinculum device list.

`status` is one of `UP`, `SLEEP` (battery device between wake-ups) or `DOWN`.

Output (assuming hub ID 123456 and node 27 belonging to device 17):

```
topic: homeassistant/device/futurehome_123456_17/availability
online
```
 */
export function haUpdateAvailability(parameters: {
  hubId: string;
  deviceId: string;
  status: string;
}) {
  const availabilityTopic = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.deviceId}/availability`;

  // Sleeping battery devices are still part of the network and will report
  // when they wake up, so only treat explicitly non-responding nodes as offline.
  const availability =
    parameters.status === 'UP' || parameters.status === 'SLEEP'
      ? 'online'
      : 'offline';

  log.debug(`Publishing HA availability "${availabilityTopic}"`);
  ha?.publish(availabilityTopic, availability, { retain: true, qos: 2 });
}

// Adapter resource names (`rn:` in the FIMP topic) that differ from the
// `fimp.adapter` value stored on vinculum devices.
const adapterByResourceName: Record<string, string> = {
  zw: 'zwave-ad',
};

/**
 * Returns the vinculum device IDs belonging to a node from an
 * evt.network.all_nodes_report sent on `topic`. A node can back several
 * devices (e.g. one per channel).
 */
export function deviceIdsForNode(parameters: {
  devices: VinculumPd7Device[];
  topic: string;
  address: string;
}): string[] {
  const resourceName = parameters.topic.match(/\/rn:([^/]+)\//)?.[1];
  if (!resourceName) {
    return [];
  }
  const adapter = adapterByResourceName[resourceName] ?? resourceName;

  return parameters.devices
    .filter(
      (d) =>
        d.fimp?.adapter === adapter &&
        d.fimp?.address?.toString() === parameters.address,
    )
    .map((d) => d.id.toString());
}
