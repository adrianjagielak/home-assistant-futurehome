// Maps a Futurehome “scene_ctrl” service to MQTT entities
// ─────────────────────────────────────────────────────────────
// FIMP ➞ HA state paths used by the value templates
//   value_json[svc.addr].scene   – last reported scene name (string)
//   value_json[svc.addr].lvl     – last reported level          (int)
//
// HA ➞ FIMP commands
//   <topicPrefix><addr>/scene/command   →  cmd.scene.set
// ─────────────────────────────────────────────────────────────

import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';

/**
 * Creates MQTT components for a single *scene_ctrl* service.
 */
export function scene_ctrl__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // ───────────── read-only entities ─────────────
  if (svc.intf?.includes('evt.scene.report')) {
    components[`${svc.addr}_scene`] = {
      unique_id: `${svc.addr}_scene`,
      platform: 'sensor',
      name: 'Scene',
      unit_of_measurement: '',
      value_template: `{{ value_json['${svc.addr}'].scene }}`,
    };
  }

  // ───────────── writeable “select” (scene activator) ─────────────
  const supScenes: string[] = svc.props?.sup_scenes ?? [];
  if (svc.intf?.includes('cmd.scene.set') && supScenes.length) {
    const commandTopic = `${topicPrefix}${svc.addr}/scene/command`;

    components[`${svc.addr}_select`] = {
      unique_id: `${svc.addr}_select`,
      platform: 'select',
      name: 'Scene',
      options: supScenes,
      command_topic: commandTopic,
      optimistic: false,
      value_template: `{{ value_json['${svc.addr}'].scene }}`,
    };

    commandHandlers[commandTopic] = async (payload: string) => {
      if (!supScenes.includes(payload)) return; // ignore bogus payloads

      await sendFimpMsg({
        address: svc.addr!,
        service: 'scene_ctrl',
        cmd: 'cmd.scene.set',
        val_t: 'string',
        val: payload,
      });
    };
  }

  // Nothing useful to expose?
  if (!Object.keys(components).length) return undefined;

  return {
    components,
    commandHandlers,
  };
}
