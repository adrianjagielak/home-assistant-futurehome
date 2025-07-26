// Maps a Futurehome “basic” service to one MQTT *number* entity.
// ───────────────────────────────────────────────────────────────
// FIMP ➞ HA state path used by the template
//   value_json[svc.addr].lvl           – current level (0-255)
//
// HA ➞ FIMP commands
//   command_topic → cmd.lvl.set
// ───────────────────────────────────────────────────────────────

import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { ServiceComponentsCreationResult } from '../ha/publish_device';

export function basic__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  // MQTT topic that HA will publish commands to
  const cmdTopic = `${topicPrefix}${svc.addr}/command`;

  // Z-Wave “Basic” uses a 0-255 range (0 = off, 255 = on, 1-254 = dim level)
  const MIN_LVL = 0;
  const MAX_LVL = 255;

  return {
    components: {
      [svc.addr]: {
        unique_id: svc.addr,
        platform: 'number',
        entity_category: 'config',
        name: device.client?.name ?? device?.modelAlias,
        min: MIN_LVL,
        max: MAX_LVL,
        step: 1,
        command_topic: cmdTopic,
        optimistic: false,
        value_template: `{{ value_json['${svc.addr}'].lvl }}`,
      },
    },

    // ─────── HA → FIMP bridge ───────
    commandHandlers: {
      [cmdTopic]: async (payload: string) => {
        const lvl = parseInt(payload, 10);
        if (Number.isNaN(lvl)) return;

        await sendFimpMsg({
          address: svc.addr!,
          service: 'basic',
          cmd: 'cmd.lvl.set',
          val_t: 'int',
          val: lvl,
        });
      },
    },
  };
}
