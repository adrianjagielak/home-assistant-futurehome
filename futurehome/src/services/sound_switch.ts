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
import { log } from '../logger';

export function sound_switch__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  const stateTopic = `${topicPrefix}/state`;
  const supTones = svc.props?.sup_tones || [];
  const supportsPlayWithVolume = svc.props?.supports_play_with_volume === true;

  // Create a siren component for playing tones
  if (svc.intf?.includes('cmd.play.set')) {
    const sirenCommandTopic = `${topicPrefix}${svc.addr}/siren/command`;

    // Extract tone names for available_tones
    const toneNames = supTones.map(
      (tone: any) => tone.name || `Tone ${tone.tone_id}`,
    );

    const sirenComponent: HaMqttComponent = {
      unique_id: `${svc.addr}_siren`,
      platform: 'siren',
      name: 'Sound Switch',
      icon: 'mdi:volume-high',
      command_topic: sirenCommandTopic,
      state_topic: stateTopic,
      state_value_template: `{{ 'ON' if value_json['${svc.addr}'].play.tone_id is defined else 'OFF' }}`,
      optimistic: false,
      support_duration: false, // FIMP doesn't support custom duration
      support_volume_set: supportsPlayWithVolume,
    };

    if (toneNames.length > 0) {
      sirenComponent.available_tones = toneNames;
    }

    components[`${svc.addr}_siren`] = sirenComponent;

    commandHandlers[sirenCommandTopic] = async (payload: string) => {
      try {
        const command = JSON.parse(payload);

        if (command.state === 'OFF') {
          // Stop playing
          await sendFimpMsg({
            address: svc.addr,
            service: 'sound_switch',
            cmd: 'cmd.play.stop',
            val_t: 'null',
            val: null,
          });
        } else if (command.state === 'ON') {
          // Start playing
          const playMap: any = {};

          // Handle tone selection
          if (command.tone && toneNames.includes(command.tone)) {
            const toneIndex = toneNames.indexOf(command.tone);
            const selectedTone = supTones[toneIndex];
            if (selectedTone?.tone_id) {
              playMap.tone_id = selectedTone.tone_id;
            }
          }

          // Handle volume if supported
          if (supportsPlayWithVolume && command.volume_level !== undefined) {
            playMap.volume = Math.round(command.volume_level * 100);
          }

          await sendFimpMsg({
            address: svc.addr,
            service: 'sound_switch',
            cmd: 'cmd.play.set',
            val_t: 'int_map',
            val: playMap,
          });
        }
      } catch (e) {
        log.error('sound_switch: Failed setting the siren', e);
        // Fallback for simple ON/OFF commands
        if (payload === 'ON') {
          await sendFimpMsg({
            address: svc.addr,
            service: 'sound_switch',
            cmd: 'cmd.play.set',
            val_t: 'int_map',
            val: {}, // Play with default settings
          });
        } else if (payload === 'OFF') {
          await sendFimpMsg({
            address: svc.addr,
            service: 'sound_switch',
            cmd: 'cmd.play.stop',
            val_t: 'null',
            val: null,
          });
        }
      }
    };
  }

  // Create a select component for tone selection when not playing
  if (supTones.length > 0 && svc.intf?.includes('cmd.play.set')) {
    const toneSelectCommandTopic = `${topicPrefix}${svc.addr}/tone_select/command`;
    const toneNames = supTones.map(
      (tone: any) => tone.name || `Tone ${tone.tone_id}`,
    );

    components[`${svc.addr}_tone_select`] = {
      unique_id: `${svc.addr}_tone_select`,
      platform: 'select',
      name: 'Tone Selection',
      icon: 'mdi:music-note',
      command_topic: toneSelectCommandTopic,
      state_topic: stateTopic,
      options: toneNames,
      value_template: `{% set play = value_json['${svc.addr}'].play %}{% if play and play.tone_id %}{% for tone in ${JSON.stringify(supTones)} %}{% if tone.tone_id == play.tone_id %}{{ tone.name }}{% endif %}{% endfor %}{% else %}{{ '${toneNames[0]}' }}{% endif %}`,
      optimistic: false,
    };

    commandHandlers[toneSelectCommandTopic] = async (payload: string) => {
      if (!toneNames.includes(payload)) {
        return;
      }

      const toneIndex = toneNames.indexOf(payload);
      const selectedTone = supTones[toneIndex];

      if (selectedTone?.tone_id) {
        await sendFimpMsg({
          address: svc.addr,
          service: 'sound_switch',
          cmd: 'cmd.play.set',
          val_t: 'int_map',
          val: {
            tone_id: selectedTone.tone_id,
          },
        });
      }
    };
  }

  // Create a number component for volume control if supported in config
  if (svc.intf?.includes('cmd.config.set') || supportsPlayWithVolume) {
    const volumeCommandTopic = `${topicPrefix}${svc.addr}/volume/command`;

    components[`${svc.addr}_volume`] = {
      unique_id: `${svc.addr}_volume`,
      platform: 'number',
      name: 'Volume',
      icon: 'mdi:volume-high',
      command_topic: volumeCommandTopic,
      state_topic: stateTopic,
      min: 0,
      max: 100,
      step: 1,
      unit_of_measurement: '%',
      value_template: `{{ value_json['${svc.addr}'].config.volume | default(50) }}`,
      optimistic: false,
    };

    commandHandlers[volumeCommandTopic] = async (payload: string) => {
      const volume = parseInt(payload, 10);
      if (Number.isNaN(volume) || volume < 0 || volume > 100) {
        return;
      }

      if (svc.intf?.includes('cmd.config.set')) {
        // Update configuration
        await sendFimpMsg({
          address: svc.addr,
          service: 'sound_switch',
          cmd: 'cmd.config.set',
          val_t: 'int_map',
          val: {
            volume: volume,
          },
        });
      }
    };
  }

  // Create a select component for default tone configuration
  if (supTones.length > 0 && svc.intf?.includes('cmd.config.set')) {
    const defaultToneCommandTopic = `${topicPrefix}${svc.addr}/default_tone/command`;
    const toneNames = supTones.map(
      (tone: any) => tone.name || `Tone ${tone.tone_id}`,
    );

    components[`${svc.addr}_default_tone`] = {
      unique_id: `${svc.addr}_default_tone`,
      platform: 'select',
      name: 'Default Tone',
      icon: 'mdi:music-note-outline',
      entity_category: 'config',
      command_topic: defaultToneCommandTopic,
      state_topic: stateTopic,
      options: toneNames,
      value_template: `{% set config = value_json['${svc.addr}'].config %}{% if config and config.default_tone_id %}{% for tone in ${JSON.stringify(supTones)} %}{% if tone.tone_id == config.default_tone_id %}{{ tone.name }}{% endif %}{% endfor %}{% else %}{{ '${toneNames[0]}' }}{% endif %}`,
      optimistic: false,
    };

    commandHandlers[defaultToneCommandTopic] = async (payload: string) => {
      if (!toneNames.includes(payload)) {
        return;
      }

      const toneIndex = toneNames.indexOf(payload);
      const selectedTone = supTones[toneIndex];

      if (selectedTone?.tone_id) {
        await sendFimpMsg({
          address: svc.addr,
          service: 'sound_switch',
          cmd: 'cmd.config.set',
          val_t: 'int_map',
          val: {
            default_tone_id: selectedTone.tone_id,
          },
        });
      }
    };
  }

  // Create button components for stop action and configuration requests
  if (svc.intf?.includes('cmd.play.stop')) {
    const stopCommandTopic = `${topicPrefix}${svc.addr}/stop/command`;

    components[`${svc.addr}_stop`] = {
      unique_id: `${svc.addr}_stop`,
      platform: 'button',
      name: 'Stop Sound',
      icon: 'mdi:stop',
      command_topic: stopCommandTopic,
    };

    commandHandlers[stopCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'sound_switch',
        cmd: 'cmd.play.stop',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Button to request current configuration
  if (svc.intf?.includes('cmd.config.get_report')) {
    const configRequestCommandTopic = `${topicPrefix}${svc.addr}/config_request/command`;

    components[`${svc.addr}_config_request`] = {
      unique_id: `${svc.addr}_config_request`,
      platform: 'button',
      name: 'Refresh Configuration',
      icon: 'mdi:refresh',
      entity_category: 'diagnostic',
      command_topic: configRequestCommandTopic,
    };

    commandHandlers[configRequestCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'sound_switch',
        cmd: 'cmd.config.get_report',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Button to request current play status
  if (svc.intf?.includes('cmd.play.get_report')) {
    const playRequestCommandTopic = `${topicPrefix}${svc.addr}/play_request/command`;

    components[`${svc.addr}_play_request`] = {
      unique_id: `${svc.addr}_play_request`,
      platform: 'button',
      name: 'Refresh Play Status',
      icon: 'mdi:refresh',
      entity_category: 'diagnostic',
      command_topic: playRequestCommandTopic,
    };

    commandHandlers[playRequestCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'sound_switch',
        cmd: 'cmd.play.get_report',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Create sensors for tone information if available
  if (supTones.length > 0) {
    // Sensor for current playing tone name
    components[`${svc.addr}_current_tone`] = {
      unique_id: `${svc.addr}_current_tone`,
      platform: 'sensor',
      name: 'Current Tone',
      icon: 'mdi:music-note',
      state_topic: stateTopic,
      value_template: `{% set play = value_json['${svc.addr}'].play %}{% if play and play.tone_id %}{% for tone in ${JSON.stringify(supTones)} %}{% if tone.tone_id == play.tone_id %}{{ tone.name }}{% endif %}{% endfor %}{% else %}None{% endif %}`,
    };

    // Sensor for current playing tone duration
    components[`${svc.addr}_tone_duration`] = {
      unique_id: `${svc.addr}_tone_duration`,
      platform: 'sensor',
      name: 'Tone Duration',
      icon: 'mdi:timer',
      entity_category: 'diagnostic',
      state_topic: stateTopic,
      unit_of_measurement: 's',
      value_template: `{% set play = value_json['${svc.addr}'].play %}{% if play and play.tone_id %}{% for tone in ${JSON.stringify(supTones)} %}{% if tone.tone_id == play.tone_id %}{{ tone.duration }}{% endif %}{% endfor %}{% else %}0{% endif %}`,
    };
  }

  // Volume sensor if volume is reported in play state
  if (supportsPlayWithVolume) {
    components[`${svc.addr}_current_volume`] = {
      unique_id: `${svc.addr}_current_volume`,
      platform: 'sensor',
      name: 'Current Volume',
      icon: 'mdi:volume-high',
      state_topic: stateTopic,
      unit_of_measurement: '%',
      value_template: `{{ value_json['${svc.addr}'].play.volume | default(0) }}`,
    };
  }

  return {
    components,
    commandHandlers,
  };
}
