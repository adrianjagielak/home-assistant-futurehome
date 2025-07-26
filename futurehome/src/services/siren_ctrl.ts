import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { SirenComponent } from '../ha/mqtt_components/siren';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';

export function siren_ctrl__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Extract supported modes from service properties
  const supModes = svc.props?.sup_modes || [];

  if (supModes.length === 0) {
    // If no supported modes are defined, we can't create a functional siren
    return undefined;
  }

  // Main siren component
  const commandTopic = `${topicPrefix}${svc.addr}/command`;

  // Determine available tones based on supported modes
  // Filter out 'off' as it's handled separately by Home Assistant
  const availableTones = supModes.filter((mode: string) => mode !== 'off');

  const sirenComponent: SirenComponent = {
    unique_id: svc.addr,
    platform: 'siren',
    name: 'Siren',
    command_topic: commandTopic,
    optimistic: false,
    state_value_template: `{{ (value_json['${svc.addr}'].mode != "off") | iif('ON', 'OFF') }}`,
    support_duration: false,
    support_volume_set: false,
  };

  // Add available tones if there are specific tone modes
  if (availableTones.length > 0) {
    sirenComponent.available_tones = availableTones;
    // Use command template to handle tone selection
    sirenComponent.command_template = `{% if value == "ON" %}{% if tone is defined %}{{ tone }}{% else %}{{ available_tones[0] if available_tones else "on" }}{% endif %}{% else %}off{% endif %}`;
  }

  // Map Home Assistant state values to display values
  sirenComponent.state_value_template = `{% set mode = value_json['${svc.addr}'].mode | default('off') %}{% if mode == 'off' %}OFF{% else %}ON{% endif %}`;

  components[svc.addr] = sirenComponent;

  // Command handler
  commandHandlers[commandTopic] = async (payload: string) => {
    let targetMode: string;

    // Handle different payload formats
    try {
      // Try to parse as JSON first (for tone commands)
      const jsonPayload = JSON.parse(payload);

      if (jsonPayload.state === 'ON' || jsonPayload.state === true) {
        // If tone is specified and supported, use it
        if (jsonPayload.tone && supModes.includes(jsonPayload.tone)) {
          targetMode = jsonPayload.tone;
        } else {
          // Use first available non-off mode or 'on' as fallback
          targetMode = availableTones.length > 0 ? availableTones[0] : 'on';
        }
      } else {
        targetMode = 'off';
      }
    } catch {
      // Handle simple string payloads
      switch (payload) {
        case 'ON':
        case 'on':
          // Use first available tone or 'on' as fallback
          targetMode = availableTones.length > 0 ? availableTones[0] : 'on';
          break;
        case 'OFF':
        case 'off':
          targetMode = 'off';
          break;
        default:
          // Check if payload is a supported mode/tone
          if (supModes.includes(payload)) {
            targetMode = payload;
          } else {
            return; // Unsupported payload
          }
      }
    }

    // Only send command if the target mode is supported
    if (!supModes.includes(targetMode)) {
      return;
    }

    await sendFimpMsg({
      address: svc.addr,
      service: 'siren_ctrl',
      cmd: 'cmd.mode.set',
      val_t: 'string',
      val: targetMode,
    });
  };

  return {
    components,
    commandHandlers,
  };
}
