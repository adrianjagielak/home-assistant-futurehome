import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { BinarySensorDeviceClass } from '../ha/mqtt_components/_enums';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';

export function door_lock__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  const stateTopic = `${topicPrefix}/state`;

  // Main lock component
  if (
    svc.intf?.includes('cmd.lock.set') &&
    svc.intf?.includes('evt.lock.report')
  ) {
    const lockCommandTopic = `${topicPrefix}${svc.addr}/lock/command`;

    components[`${svc.addr}_lock`] = {
      unique_id: `${svc.addr}_lock`,
      platform: 'lock',
      name: 'Lock',
      command_topic: lockCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      // Map the lock state based on is_secured component
      value_template: `{{ 'LOCKED' if value_json['${svc.addr}'].lock.is_secured else 'UNLOCKED' }}`,
      payload_lock: 'LOCK',
      payload_unlock: 'UNLOCK',
    };

    commandHandlers[lockCommandTopic] = async (payload: string) => {
      const isLock = payload === 'LOCK';

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set',
        val_t: 'bool',
        val: isLock,
      });
    };
  }

  // Individual lock components as binary sensors
  const supComponents = svc.props?.sup_components || [];

  for (const component of supComponents) {
    let deviceClass: BinarySensorDeviceClass;
    let name: string;

    switch (component) {
      case 'is_secured':
        deviceClass = 'lock';
        name = 'Secured';
        break;
      case 'door_is_closed':
        deviceClass = 'door';
        name = 'Door Closed';
        break;
      case 'bolt_is_locked':
        deviceClass = 'lock';
        name = 'Bolt Locked';
        break;
      case 'latch_is_closed':
        deviceClass = 'lock';
        name = 'Latch Closed';
        break;
      default:
        deviceClass = 'lock';
        name = component
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
    }

    components[`${svc.addr}_${component}`] = {
      unique_id: `${svc.addr}_${component}`,
      platform: 'binary_sensor',
      name: name,
      device_class: deviceClass,
      entity_category: 'diagnostic',
      state_topic: stateTopic,
      value_template: `{{ 'ON' if value_json['${svc.addr}'].lock.${component} else 'OFF' }}`,
    };
  }

  // Auto-lock switch
  if (
    svc.intf?.includes('cmd.auto_lock.set') &&
    svc.intf?.includes('evt.auto_lock.report')
  ) {
    const autoLockCommandTopic = `${topicPrefix}${svc.addr}/auto_lock/command`;

    components[`${svc.addr}_auto_lock`] = {
      unique_id: `${svc.addr}_auto_lock`,
      platform: 'switch',
      name: 'Auto Lock',
      entity_category: 'config',
      command_topic: autoLockCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      value_template: `{{ 'ON' if value_json['${svc.addr}'].auto_lock else 'OFF' }}`,
      payload_on: 'ON',
      payload_off: 'OFF',
    };

    commandHandlers[autoLockCommandTopic] = async (payload: string) => {
      const enabled = payload === 'ON';

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.auto_lock.set',
        val_t: 'bool',
        val: enabled,
      });
    };
  }

  // Volume control
  if (
    svc.intf?.includes('cmd.volume.set') &&
    svc.intf?.includes('evt.volume.report')
  ) {
    const volumeCommandTopic = `${topicPrefix}${svc.addr}/volume/command`;
    const minVolume = svc.props?.min_volume ?? 0;
    const maxVolume = svc.props?.max_volume ?? 10;

    components[`${svc.addr}_volume`] = {
      unique_id: `${svc.addr}_volume`,
      platform: 'number',
      name: 'Volume',
      entity_category: 'config',
      command_topic: volumeCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      min: minVolume,
      max: maxVolume,
      step: 1,
      value_template: `{{ value_json['${svc.addr}'].volume | default(${minVolume}) }}`,
    };

    commandHandlers[volumeCommandTopic] = async (payload: string) => {
      const volume = parseInt(payload, 10);
      if (Number.isNaN(volume) || volume < minVolume || volume > maxVolume) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.volume.set',
        val_t: 'int',
        val: volume,
      });
    };
  }

  // Lock configuration button
  if (svc.intf?.includes('cmd.lock.get_configuration')) {
    const getConfigCommandTopic = `${topicPrefix}${svc.addr}/get_configuration/command`;

    components[`${svc.addr}_get_config`] = {
      unique_id: `${svc.addr}_get_config`,
      platform: 'button',
      name: 'Get Configuration',
      entity_category: 'diagnostic',
      command_topic: getConfigCommandTopic,
    };

    commandHandlers[getConfigCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.get_configuration',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Get lock report button
  if (svc.intf?.includes('cmd.lock.get_report')) {
    const getLockReportCommandTopic = `${topicPrefix}${svc.addr}/get_lock_report/command`;

    components[`${svc.addr}_get_lock_report`] = {
      unique_id: `${svc.addr}_get_lock_report`,
      platform: 'button',
      name: 'Get Lock Report',
      entity_category: 'diagnostic',
      command_topic: getLockReportCommandTopic,
    };

    commandHandlers[getLockReportCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.get_report',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Get auto-lock report button
  if (svc.intf?.includes('cmd.auto_lock.get_report')) {
    const getAutoLockReportCommandTopic = `${topicPrefix}${svc.addr}/get_auto_lock_report/command`;

    components[`${svc.addr}_get_auto_lock_report`] = {
      unique_id: `${svc.addr}_get_auto_lock_report`,
      platform: 'button',
      name: 'Get Auto Lock Report',
      entity_category: 'diagnostic',
      command_topic: getAutoLockReportCommandTopic,
    };

    commandHandlers[getAutoLockReportCommandTopic] = async (
      _payload: string,
    ) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.auto_lock.get_report',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Get volume report button
  if (svc.intf?.includes('cmd.volume.get_report')) {
    const getVolumeReportCommandTopic = `${topicPrefix}${svc.addr}/get_volume_report/command`;

    components[`${svc.addr}_get_volume_report`] = {
      unique_id: `${svc.addr}_get_volume_report`,
      platform: 'button',
      name: 'Get Volume Report',
      entity_category: 'diagnostic',
      command_topic: getVolumeReportCommandTopic,
    };

    commandHandlers[getVolumeReportCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.volume.get_report',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Operation type configuration
  const supOpTypes = svc.props?.sup_op_types || [];
  if (
    supOpTypes.length > 0 &&
    svc.intf?.includes('cmd.lock.set_configuration')
  ) {
    const opTypeCommandTopic = `${topicPrefix}${svc.addr}/operation_type/command`;

    components[`${svc.addr}_operation_type`] = {
      unique_id: `${svc.addr}_operation_type`,
      platform: 'select',
      name: 'Operation Type',
      entity_category: 'config',
      command_topic: opTypeCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      options: supOpTypes,
      value_template: `{{ value_json['${svc.addr}'].configuration.operation_type | default('${supOpTypes[0]}') }}`,
    };

    commandHandlers[opTypeCommandTopic] = async (payload: string) => {
      if (!supOpTypes.includes(payload)) {
        return;
      }

      // Send a partial configuration update
      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set_configuration',
        val_t: 'object',
        val: {
          operation_type: payload,
        },
      });
    };
  }

  // Auto-relock time configuration (if supported)
  if (svc.props?.supports_auto_relock) {
    const minAutoRelock = svc.props?.min_auto_relock_time ?? 0;
    const maxAutoRelock = svc.props?.max_auto_relock_time ?? 65535;
    const autoRelockTimeCommandTopic = `${topicPrefix}${svc.addr}/auto_relock_time/command`;

    components[`${svc.addr}_auto_relock_time`] = {
      unique_id: `${svc.addr}_auto_relock_time`,
      platform: 'number',
      name: 'Auto Relock Time',
      entity_category: 'config',
      command_topic: autoRelockTimeCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      min: minAutoRelock,
      max: maxAutoRelock,
      step: 1,
      unit_of_measurement: 's',
      value_template: `{{ value_json['${svc.addr}'].configuration.auto_relock_time | default(0) }}`,
    };

    commandHandlers[autoRelockTimeCommandTopic] = async (payload: string) => {
      const time = parseInt(payload, 10);
      if (Number.isNaN(time) || time < minAutoRelock || time > maxAutoRelock) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set_configuration',
        val_t: 'object',
        val: {
          auto_relock_time: time,
        },
      });
    };
  }

  // Hold and release time configuration (if supported)
  if (svc.props?.supports_hold_and_release) {
    const minHoldRelease = svc.props?.min_hold_and_release_time ?? 1;
    const maxHoldRelease = svc.props?.max_hold_and_release_time ?? 65535;
    const holdReleaseTimeCommandTopic = `${topicPrefix}${svc.addr}/hold_release_time/command`;

    components[`${svc.addr}_hold_release_time`] = {
      unique_id: `${svc.addr}_hold_release_time`,
      platform: 'number',
      name: 'Hold & Release Time',
      entity_category: 'config',
      command_topic: holdReleaseTimeCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      min: minHoldRelease,
      max: maxHoldRelease,
      step: 1,
      unit_of_measurement: 's',
      value_template: `{{ value_json['${svc.addr}'].configuration.hold_and_release_time | default(0) }}`,
    };

    commandHandlers[holdReleaseTimeCommandTopic] = async (payload: string) => {
      const time = parseInt(payload, 10);
      if (
        Number.isNaN(time) ||
        time < minHoldRelease ||
        time > maxHoldRelease
      ) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set_configuration',
        val_t: 'object',
        val: {
          hold_and_release_time: time,
        },
      });
    };
  }

  // Block to block configuration (if supported)
  if (svc.props?.supports_block_to_block) {
    const blockToBlockCommandTopic = `${topicPrefix}${svc.addr}/block_to_block/command`;

    components[`${svc.addr}_block_to_block`] = {
      unique_id: `${svc.addr}_block_to_block`,
      platform: 'switch',
      name: 'Block to Block',
      entity_category: 'config',
      command_topic: blockToBlockCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      value_template: `{{ 'ON' if value_json['${svc.addr}'].configuration.block_to_block else 'OFF' }}`,
      payload_on: 'ON',
      payload_off: 'OFF',
    };

    commandHandlers[blockToBlockCommandTopic] = async (payload: string) => {
      const enabled = payload === 'ON';

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set_configuration',
        val_t: 'object',
        val: {
          block_to_block: enabled,
        },
      });
    };
  }

  // Twist assist configuration (if supported)
  if (svc.props?.supports_twist_assist) {
    const twistAssistCommandTopic = `${topicPrefix}${svc.addr}/twist_assist/command`;

    components[`${svc.addr}_twist_assist`] = {
      unique_id: `${svc.addr}_twist_assist`,
      platform: 'switch',
      name: 'Twist Assist',
      entity_category: 'config',
      command_topic: twistAssistCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      value_template: `{{ 'ON' if value_json['${svc.addr}'].configuration.twist_assist else 'OFF' }}`,
      payload_on: 'ON',
      payload_off: 'OFF',
    };

    commandHandlers[twistAssistCommandTopic] = async (payload: string) => {
      const enabled = payload === 'ON';

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set_configuration',
        val_t: 'object',
        val: {
          twist_assist: enabled,
        },
      });
    };
  }

  // Lock timeout configuration (if timed operation is supported)
  if (supOpTypes.includes('timed')) {
    const minTimeoutSeconds = svc.props?.min_lock_timeout_seconds ?? 0;
    const maxTimeoutSeconds = svc.props?.max_lock_timeout_seconds ?? 59;
    const minTimeoutMinutes = svc.props?.min_lock_timeout_minutes ?? 0;
    const maxTimeoutMinutes = svc.props?.max_lock_timeout_minutes ?? 253;

    // Lock timeout seconds
    const timeoutSecondsCommandTopic = `${topicPrefix}${svc.addr}/lock_timeout_seconds/command`;

    components[`${svc.addr}_lock_timeout_seconds`] = {
      unique_id: `${svc.addr}_lock_timeout_seconds`,
      platform: 'number',
      name: 'Lock Timeout Seconds',
      entity_category: 'config',
      command_topic: timeoutSecondsCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      min: minTimeoutSeconds,
      max: maxTimeoutSeconds,
      step: 1,
      unit_of_measurement: 's',
      value_template: `{{ value_json['${svc.addr}'].configuration.lock_timeout_seconds | default(0) }}`,
    };

    commandHandlers[timeoutSecondsCommandTopic] = async (payload: string) => {
      const seconds = parseInt(payload, 10);
      if (
        Number.isNaN(seconds) ||
        seconds < minTimeoutSeconds ||
        seconds > maxTimeoutSeconds
      ) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set_configuration',
        val_t: 'object',
        val: {
          lock_timeout_seconds: seconds,
        },
      });
    };

    // Lock timeout minutes
    const timeoutMinutesCommandTopic = `${topicPrefix}${svc.addr}/lock_timeout_minutes/command`;

    components[`${svc.addr}_lock_timeout_minutes`] = {
      unique_id: `${svc.addr}_lock_timeout_minutes`,
      platform: 'number',
      name: 'Lock Timeout Minutes',
      entity_category: 'config',
      command_topic: timeoutMinutesCommandTopic,
      state_topic: stateTopic,
      optimistic: false,
      min: minTimeoutMinutes,
      max: maxTimeoutMinutes,
      step: 1,
      unit_of_measurement: 'min',
      value_template: `{{ value_json['${svc.addr}'].configuration.lock_timeout_minutes | default(0) }}`,
    };

    commandHandlers[timeoutMinutesCommandTopic] = async (payload: string) => {
      const minutes = parseInt(payload, 10);
      if (
        Number.isNaN(minutes) ||
        minutes < minTimeoutMinutes ||
        minutes > maxTimeoutMinutes
      ) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'door_lock',
        cmd: 'cmd.lock.set_configuration',
        val_t: 'object',
        val: {
          lock_timeout_minutes: minutes,
        },
      });
    };
  }

  return {
    components,
    commandHandlers,
  };
}
