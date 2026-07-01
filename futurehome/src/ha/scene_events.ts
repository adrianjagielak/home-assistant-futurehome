// Publishes Futurehome `scene_ctrl` reports as Home Assistant `event` entities.
// ─────────────────────────────────────────────────────────────
// A scene controller (button, remote, Fibaro/Namron scene switch, …) is a
// momentary, stateless device: it fires a scene when pressed and has no
// meaningful "current" value. Representing it as a plain sensor means the
// entity is stuck on `unknown` until the first press and then latches on the
// last value forever – so repeated presses of the same button never change the
// state and cannot drive automations.
//
// Home Assistant's `event` platform exists exactly for this: every received
// message fires the entity's event trigger, even for repeated identical
// presses. We publish each `evt.scene.report` to a dedicated, non-retained
// topic as `{ "event_type": <scene> }`.
// ─────────────────────────────────────────────────────────────

import { ha } from './globals';

/**
 * A best-effort list of scene values commonly reported by Z-Wave Central Scene
 * and Zigbee scene controllers. Home Assistant discards events whose
 * `event_type` is not in the entity's `event_types`, so this is merged with the
 * device-reported `sup_scenes` to give a working entity out of the box.
 */
export const DEFAULT_SCENE_EVENT_TYPES: string[] = (() => {
  const types = ['on', 'off', 'toggle'];
  const actions = [
    'key_pressed_1_time',
    'key_released',
    'key_held_down',
    'key_pressed_2_times',
    'key_pressed_3_times',
    'key_pressed_4_times',
    'key_pressed_5_times',
  ];
  for (let button = 1; button <= 8; button++) {
    types.push(`${button}`, `${button}.0`);
    for (const action of actions) {
      types.push(`${button}.${action}`);
    }
  }
  return types;
})();

export function sceneEventStateTopic(topicPrefix: string, addr: string): string {
  return `${topicPrefix}${addr}/scene/event`;
}

/** Merges the device-reported supported scenes with the default list. */
export function buildSceneEventTypes(
  supScenes: string[] | null | undefined,
): string[] {
  const types = new Set<string>(DEFAULT_SCENE_EVENT_TYPES);
  for (const scene of supScenes ?? []) {
    if (typeof scene === 'string' && scene) {
      types.add(scene);
    }
  }
  return [...types];
}

// Maps a scene service address to its dedicated Home Assistant event topic.
const sceneEventTopics: Record<string, string> = {};

export function registerSceneEventTopic(addr: string, topic: string): void {
  sceneEventTopics[addr] = topic;
}

/**
 * Publishes a scene report as a Home Assistant event. Called for every
 * `evt.scene.report`; the `addr` is the service address (the FIMP event topic
 * without its `pt:j1/mt:evt` envelope).
 */
export function publishSceneEvent(parameters: {
  addr: string;
  value: unknown;
}): void {
  const topic = sceneEventTopics[parameters.addr];
  if (!topic) {
    return;
  }

  if (
    typeof parameters.value !== 'string' &&
    typeof parameters.value !== 'number'
  ) {
    return;
  }
  const eventType = String(parameters.value);
  if (!eventType) {
    return;
  }

  ha?.publish(topic, JSON.stringify({ event_type: eventType }), {
    retain: false,
    qos: 2,
  });
}
