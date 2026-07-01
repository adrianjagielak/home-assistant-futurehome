// Maps a Futurehome “scene_ctrl” service to MQTT entities
// ─────────────────────────────────────────────────────────────
// FIMP ➞ HA
//   evt.scene.report  →  <topicPrefix><addr>/scene/event  (Home Assistant event)
//   value_json[svc.addr].scene   – last reported scene name (string)
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
  buildSceneEventTypes,
  registerSceneEventTopic,
  sceneEventStateTopic,
} from '../ha/scene_events';
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

  const supScenes: string[] = svc.props?.sup_scenes ?? [];

  if (svc.intf?.includes('evt.scene.report')) {
    // Scene controllers are momentary/stateless, so a plain sensor is stuck on
    // `unknown` and can't drive automations on repeated presses. The `event`
    // platform fires the entity's trigger on every reported scene instead, so
    // it's the entity to use in automations. The sensor is kept for backwards
    // compatibility (it shows the last reported scene).
    const eventStateTopic = sceneEventStateTopic(topicPrefix, svc.addr);
    registerSceneEventTopic(svc.addr, eventStateTopic);

    components[`${svc.addr}_scene_event`] = {
      unique_id: `${svc.addr}_scene_event`,
      platform: 'event',
      name: 'Scene',
      icon: 'mdi:gesture-tap-button',
      state_topic: eventStateTopic,
      event_types: buildSceneEventTypes(supScenes),
    };

    components[`${svc.addr}_scene`] = {
      unique_id: `${svc.addr}_scene`,
      platform: 'sensor',
      entity_category: 'diagnostic',
      name: 'Scene (last value)',
      unit_of_measurement: '',
      value_template: `{{ value_json['${svc.addr}'].scene }}`,
    };
  }

  // ───────────── writeable “select” (scene activator) ─────────────
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
