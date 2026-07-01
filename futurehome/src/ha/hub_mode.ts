// Maps the Futurehome "house mode" (Home / Away / Sleep / Vacation) to a Home
// Assistant `select` entity on the Smarthub device.
// ─────────────────────────────────────────────────────────────
// The house mode is a hub-level (Vinculum) concept, not a device service.
// It is what the physical Futurehome *Modeswitch* changes: tapping a button
// switches the whole household between its modes. Because it lives on the hub
// and not on a Z-Wave/Zigbee device, it never shows up as a device
// `scene_ctrl` event – which is why a Modeswitch previously appeared in Home
// Assistant only as a `Scene` sensor stuck on `unknown`.
//
// FIMP ➞ HA
//   • current mode  – Vinculum `house` component  → `param.house.mode`
//   • mode changed  – `evt.pd7.notify` (component "mode") → `param.current`
//   • mode list     – Vinculum `mode` component   → `param.mode[].id`
//
// HA ➞ FIMP
//   <hubPrefix>/mode/command  →  cmd.pd7.request { cmd:"set", component:"mode", id }
// ─────────────────────────────────────────────────────────────

import { FimpResponse } from '../fimp/fimp';
import { setVinculumMode } from '../fimp/vinculum';
import { log } from '../logger';
import { ha } from './globals';
import { SelectComponent } from './mqtt_components/select';
import { CommandHandlers } from './publish_device';

/**
 * Default Futurehome house modes, used when the hub does not report its mode
 * list (e.g. the `mode` component request fails or comes back empty).
 */
export const FALLBACK_MODE_IDS = ['home', 'away', 'sleep', 'vacation'];

function hubTopicPrefix(hubId: string): string {
  // e.g. "homeassistant/device/futurehome_123456_hub"
  return `homeassistant/device/futurehome_${hubId}_hub`;
}

export function hubModeStateTopic(hubId: string): string {
  return `${hubTopicPrefix(hubId)}/mode/state`;
}

export function hubModeCommandTopic(hubId: string): string {
  return `${hubTopicPrefix(hubId)}/mode/command`;
}

/**
 * Extracts the available house mode ids from a Vinculum `mode` component
 * response (`param.mode` → `[{ id, action }, …]`).
 */
export function extractModeIds(response: FimpResponse | undefined): string[] {
  const modes = response?.val?.param?.mode;
  if (!Array.isArray(modes)) {
    return [];
  }
  return modes
    .map((m: { id?: unknown }) => m?.id)
    .filter((id): id is string => typeof id === 'string' && !!id);
}

/**
 * Builds the "Mode" select entity for the Smarthub device, letting the user
 * see and change the current Futurehome house mode from Home Assistant.
 */
export function hubModeSelectComponent(parameters: {
  hubId: string;
  deviceId: string;
  modeIds: string[];
}): SelectComponent {
  return {
    unique_id: `${parameters.deviceId}_mode`,
    platform: 'select',
    name: 'Mode',
    icon: 'mdi:home-switch',
    options: parameters.modeIds,
    state_topic: hubModeStateTopic(parameters.hubId),
    command_topic: hubModeCommandTopic(parameters.hubId),
    optimistic: false,
  };
}

/**
 * Command handler that sets the Futurehome house mode when the user changes the
 * "Mode" select in Home Assistant.
 */
export function hubModeCommandHandlers(parameters: {
  hubId: string;
  demoMode: boolean;
  modeIds: string[];
}): CommandHandlers {
  return {
    [hubModeCommandTopic(parameters.hubId)]: async (payload: string) => {
      if (!parameters.modeIds.includes(payload)) {
        return; // ignore unknown modes
      }

      // Optimistically reflect the change in Home Assistant right away; the
      // hub's `evt.pd7.notify` and the periodic house poll will confirm it.
      publishHubModeState({ hubId: parameters.hubId, mode: payload });

      if (parameters.demoMode) {
        return;
      }

      try {
        await setVinculumMode(payload);
      } catch (e) {
        log.error('Failed to set Futurehome mode', e);
      }
    },
  };
}

/** Publishes the current house mode to Home Assistant (retained). */
export function publishHubModeState(parameters: {
  hubId: string;
  mode: string;
}): void {
  ha?.publish(hubModeStateTopic(parameters.hubId), parameters.mode, {
    retain: true,
    qos: 2,
  });
}

/**
 * Reads the current house mode out of a Vinculum `house` component response
 * (`param.house.mode`) and, when present, publishes it to Home Assistant.
 */
export function publishHubModeFromHouseResponse(parameters: {
  hubId: string;
  houseResponse: FimpResponse | undefined;
}): void {
  const mode = parameters.houseResponse?.val?.param?.house?.mode;
  if (typeof mode === 'string' && mode) {
    publishHubModeState({ hubId: parameters.hubId, mode });
  }
}

/**
 * Handles a Vinculum `evt.pd7.notify` message and, when it reports a house mode
 * change, updates the Home Assistant "Mode" entity. This is what reflects a
 * Futurehome Modeswitch button press (or an app / automation mode change) in
 * Home Assistant in real time.
 *
 * A mode change is broadcast on the hub component (`component: "hub"`,
 * `id: "mode"`). The new value has been observed both nested as
 * `param.mode.current` (see `primefimp` `Hub`/`HubMode`) and flat as
 * `param.current` (see the `edge-iqcontrols` / `tpflow` references), so both
 * are handled; the defensive `component: "mode"` case is handled too.
 */
export function handleModeNotify(parameters: {
  hubId: string;
  msg: FimpResponse;
}): void {
  const notify = parameters.msg.val;
  if (!notify) {
    return;
  }
  if (notify.component !== 'hub' && notify.component !== 'mode') {
    return;
  }

  const param = notify.param ?? {};
  const current =
    (typeof param.mode === 'object' &&
      param.mode &&
      typeof param.mode.current === 'string' &&
      param.mode.current) ||
    (typeof param.current === 'string' && param.current) ||
    (typeof param.mode === 'string' && param.mode) ||
    undefined;

  if (current) {
    log.debug(`Futurehome house mode changed to "${current}"`);
    publishHubModeState({ hubId: parameters.hubId, mode: current });
  }
}
