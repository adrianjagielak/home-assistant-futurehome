import { log } from '../logger';
import { ha } from './globals';

/**
 * Example raw FIMP availaility (from evt.network.all_nodes_report) input:
```json
{
  "address": "1",
  "hash": "TS0202",
  "power_source": "battery",
  "status": "UP",
  "wakeup_interval": "1"
}
```

Output (assuming hub ID 123456):

```
topic: homeassistant/device/futurehome_123456_1/availability
online
```
 */
export function haUpdateAvailability(parameters: {
  hubId: string;
  deviceAvailability: any;
}) {
  const availabilityTopic = `homeassistant/device/futurehome_${parameters.hubId}_${parameters.deviceAvailability.address?.toString()}/availability`;

  const availability =
    parameters.deviceAvailability?.status === 'UP' ? 'online' : 'offline';

  log.debug(`Publishing HA availability "${availabilityTopic}"`);
  ha?.publish(availabilityTopic, availability, { retain: true, qos: 2 });
}
