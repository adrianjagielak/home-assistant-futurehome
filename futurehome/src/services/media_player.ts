import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { SensorComponent } from '../ha/mqtt_components/sensor';
import { NumberComponent } from '../ha/mqtt_components/number';
import { SwitchComponent } from '../ha/mqtt_components/switch';
import { SelectComponent } from '../ha/mqtt_components/select';
import { ImageComponent } from '../ha/mqtt_components/image';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';
import { MaterialDesignIcon } from '../ha/mqtt_components/_material_design_icon';

export function media_player__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Extract supported properties
  const supPlayback = svc.props?.sup_playback || [];
  const supModes = svc.props?.sup_modes || [];
  const supMetadata = svc.props?.sup_metadata || [];

  // Command topics
  const playbackCommandTopic = `${topicPrefix}${svc.addr}/playback/command`;
  const volumeCommandTopic = `${topicPrefix}${svc.addr}/volume/command`;
  const muteCommandTopic = `${topicPrefix}${svc.addr}/mute/command`;

  // --- Main playback control as a select entity ---
  if (supPlayback.length > 0) {
    const playbackComponent: SelectComponent = {
      unique_id: `${svc.addr}_playback`,
      platform: 'select',
      name: 'Playback Control',
      command_topic: playbackCommandTopic,
      options: supPlayback,
      optimistic: false,
      value_template: `{{ value_json['${svc.addr}'].playback | default('${supPlayback[0]}') }}`,
      icon: 'mdi:play-pause',
    };

    components[`${svc.addr}_playback`] = playbackComponent;

    // Playback command handler
    commandHandlers[playbackCommandTopic] = async (payload: string) => {
      if (!supPlayback.includes(payload)) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'media_player',
        cmd: 'cmd.playback.set',
        val_t: 'string',
        val: payload,
      });
    };
  }

  // --- Volume control as a number entity ---
  if (svc.intf?.includes('cmd.volume.set')) {
    const volumeComponent: NumberComponent = {
      unique_id: `${svc.addr}_volume`,
      platform: 'number',
      name: 'Volume',
      command_topic: volumeCommandTopic,
      min: 0,
      max: 100,
      step: 1,
      mode: 'slider',
      unit_of_measurement: '%',
      optimistic: false,
      value_template: `{{ value_json['${svc.addr}'].volume | default(50) }}`,
      icon: 'mdi:volume-high',
    };

    components[`${svc.addr}_volume`] = volumeComponent;

    // Volume command handler
    commandHandlers[volumeCommandTopic] = async (payload: string) => {
      const volume = parseInt(payload, 10);
      if (Number.isNaN(volume) || volume < 0 || volume > 100) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'media_player',
        cmd: 'cmd.volume.set',
        val_t: 'int',
        val: volume,
      });
    };
  }

  // --- Mute control as a switch entity ---
  if (svc.intf?.includes('cmd.mute.set')) {
    const muteComponent: SwitchComponent = {
      unique_id: `${svc.addr}_mute`,
      platform: 'switch',
      name: 'Mute',
      command_topic: muteCommandTopic,
      optimistic: false,
      value_template: `{{ 'ON' if value_json['${svc.addr}'].mute else 'OFF' }}`,
      payload_on: 'true',
      payload_off: 'false',
      icon: 'mdi:volume-off',
    };

    components[`${svc.addr}_mute`] = muteComponent;

    // Mute command handler
    commandHandlers[muteCommandTopic] = async (payload: string) => {
      const mute = payload === 'true' || payload === 'ON';

      await sendFimpMsg({
        address: svc.addr,
        service: 'media_player',
        cmd: 'cmd.mute.set',
        val_t: 'bool',
        val: mute,
      });
    };
  }

  // --- Playback mode controls as switch entities ---
  for (const mode of supModes) {
    const modeCommandTopic = `${topicPrefix}${svc.addr}/mode_${mode}/command`;

    const modeComponent: SwitchComponent = {
      unique_id: `${svc.addr}_mode_${mode}`,
      platform: 'switch',
      name: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`,
      command_topic: modeCommandTopic,
      optimistic: false,
      value_template: `{{ 'ON' if value_json['${svc.addr}'].playbackmode.${mode} else 'OFF' }}`,
      payload_on: 'true',
      payload_off: 'false',
      icon: getPlaybackModeIcon(mode),
    };

    components[`${svc.addr}_mode_${mode}`] = modeComponent;

    // Mode command handler
    commandHandlers[modeCommandTopic] = async (payload: string) => {
      const enabled = payload === 'true' || payload === 'ON';

      // We need to send the full playbackmode map, so we'll need to get current state
      // For now, just send the single mode change - the device should handle merging
      await sendFimpMsg({
        address: svc.addr,
        service: 'media_player',
        cmd: 'cmd.playbackmode.set',
        val_t: 'bool_map',
        val: {
          [mode]: enabled,
        },
      });
    };
  }

  // --- Metadata sensors ---
  for (const metadata of supMetadata) {
    if (metadata === 'image_url') {
      // Image metadata as image entity
      const imageComponent: ImageComponent = {
        unique_id: `${svc.addr}_${metadata}`,
        platform: 'image',
        name: 'Album Art',
        url_topic: `${topicPrefix}/state`,
        url_template: `{{ value_json['${svc.addr}'].metadata.image_url | default('') }}`,
        icon: 'mdi:image',
      };

      components[`${svc.addr}_${metadata}`] = imageComponent;
    } else {
      // Other metadata as sensor entities
      const metadataComponent: SensorComponent = {
        unique_id: `${svc.addr}_${metadata}`,
        platform: 'sensor',
        name: `${metadata.charAt(0).toUpperCase() + metadata.slice(1)}`,
        value_template: `{{ value_json['${svc.addr}'].metadata.${metadata} | default('Unknown') }}`,
        icon: getMetadataIcon(metadata),
      };

      components[`${svc.addr}_${metadata}`] = metadataComponent;
    }
  }

  return {
    components,
    commandHandlers,
  };
}

/**
 * Get appropriate icon for playback mode
 */
function getPlaybackModeIcon(mode: string): MaterialDesignIcon {
  const iconMap: Record<string, MaterialDesignIcon> = {
    repeat: 'mdi:repeat',
    repeat_one: 'mdi:repeat-once',
    shuffle: 'mdi:shuffle',
    crossfade: 'mdi:shuffle-variant',
  };
  return iconMap[mode] || 'mdi:cog';
}

/**
 * Get appropriate icon for metadata type
 */
function getMetadataIcon(metadata: string): MaterialDesignIcon {
  const iconMap: Record<string, MaterialDesignIcon> = {
    album: 'mdi:album',
    track: 'mdi:music-note',
    artist: 'mdi:account-music',
    image_url: 'mdi:image',
  };
  return iconMap[metadata] || 'mdi:information';
}
