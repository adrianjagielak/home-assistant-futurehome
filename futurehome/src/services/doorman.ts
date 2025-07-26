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

export function doorman__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Integration session sensor - shows when the lock is in integration mode
  if (svc.intf?.includes('evt.doorman_session.report')) {
    components[`${svc.addr}_session`] = {
      unique_id: `${svc.addr}_session`,
      platform: 'binary_sensor',
      name: 'Integration Session',
      device_class: 'running',
      entity_category: 'diagnostic',
      value_template: `{{ value_json['${svc.addr}'].session_active | default(false) | iif('ON', 'OFF') }}`,
    };
  }

  // User management buttons and sensors
  if (svc.intf?.includes('cmd.doorman_user.get_all')) {
    // Button to refresh user list
    const getUsersCommandTopic = `${topicPrefix}${svc.addr}/get_users/command`;

    components[`${svc.addr}_get_users`] = {
      unique_id: `${svc.addr}_get_users`,
      platform: 'button',
      name: 'Refresh Users',
      entity_category: 'config',
      command_topic: getUsersCommandTopic,
    };

    commandHandlers[getUsersCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_user.get_all',
        val_t: 'null',
        val: null,
      });
    };
  }

  // User count sensor
  components[`${svc.addr}_user_count`] = {
    unique_id: `${svc.addr}_user_count`,
    platform: 'sensor',
    name: 'User Count',
    entity_category: 'diagnostic',
    icon: 'mdi:account-multiple',
    value_template: `{{ value_json['${svc.addr}'].users.slots | length if value_json['${svc.addr}'].users.slots is defined else 0 }}`,
  };

  // Parameter management
  if (svc.intf?.includes('cmd.doorman_param.get_report')) {
    // Button to refresh parameters
    const getParamsCommandTopic = `${topicPrefix}${svc.addr}/get_params/command`;

    components[`${svc.addr}_get_params`] = {
      unique_id: `${svc.addr}_get_params`,
      platform: 'button',
      name: 'Refresh Parameters',
      entity_category: 'config',
      command_topic: getParamsCommandTopic,
    };

    commandHandlers[getParamsCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.get_report',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Configuration parameters as select entities
  if (svc.intf?.includes('cmd.doorman_param.set')) {
    // Silent mode (Parameter ID 1)
    const silentModeCommandTopic = `${topicPrefix}${svc.addr}/silent_mode/command`;

    components[`${svc.addr}_silent_mode`] = {
      unique_id: `${svc.addr}_silent_mode`,
      platform: 'select',
      name: 'Silent Mode',
      entity_category: 'config',
      options: ['Silent', 'Volume 1 (Low)', 'Volume 2 (High)'],
      command_topic: silentModeCommandTopic,
      value_template: `{% set val = value_json['${svc.addr}'].params['1'] | default('3') %}{{ {'1': 'Silent', '2': 'Volume 1 (Low)', '3': 'Volume 2 (High)'}.get(val, 'Volume 2 (High)') }}`,
    };

    commandHandlers[silentModeCommandTopic] = async (payload: string) => {
      const valueMap: Record<string, string> = {
        Silent: '1',
        'Volume 1 (Low)': '2',
        'Volume 2 (High)': '3',
      };

      const value = valueMap[payload];
      if (!value) return;

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.set',
        val_t: 'str_map',
        val: {
          parameter_id: '1',
          value: value,
        },
      });
    };

    // Auto Relock (Parameter ID 2)
    const autoRelockCommandTopic = `${topicPrefix}${svc.addr}/auto_relock/command`;

    components[`${svc.addr}_auto_relock`] = {
      unique_id: `${svc.addr}_auto_relock`,
      platform: 'switch',
      name: 'Auto Relock',
      entity_category: 'config',
      command_topic: autoRelockCommandTopic,
      value_template: `{{ (value_json['${svc.addr}'].params['2'] | default('0') == '255') | iif('ON', 'OFF') }}`,
    };

    commandHandlers[autoRelockCommandTopic] = async (payload: string) => {
      const value = payload === 'ON' ? '255' : '0';

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.set',
        val_t: 'str_map',
        val: {
          parameter_id: '2',
          value: value,
        },
      });
    };

    // Language (Parameter ID 5)
    const languageCommandTopic = `${topicPrefix}${svc.addr}/language/command`;

    components[`${svc.addr}_language`] = {
      unique_id: `${svc.addr}_language`,
      platform: 'select',
      name: 'Language',
      entity_category: 'config',
      options: ['English', 'Danish', 'Norwegian', 'Swedish'],
      command_topic: languageCommandTopic,
      value_template: `{% set val = value_json['${svc.addr}'].params['5'] | default('1') %}{{ {'1': 'English', '4': 'Danish', '5': 'Norwegian', '6': 'Swedish'}.get(val, 'English') }}`,
    };

    commandHandlers[languageCommandTopic] = async (payload: string) => {
      const valueMap: Record<string, string> = {
        English: '1',
        Danish: '4',
        Norwegian: '5',
        Swedish: '6',
      };

      const value = valueMap[payload];
      if (!value) return;

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.set',
        val_t: 'str_map',
        val: {
          parameter_id: '5',
          value: value,
        },
      });
    };

    // Home/Away Alarm Mode (Parameter ID 17)
    const alarmModeCommandTopic = `${topicPrefix}${svc.addr}/alarm_mode/command`;

    components[`${svc.addr}_alarm_mode`] = {
      unique_id: `${svc.addr}_alarm_mode`,
      platform: 'select',
      name: 'Alarm Mode',
      entity_category: 'config',
      options: ['Off', 'Home Alarm Mode', 'Away Alarm Mode'],
      command_topic: alarmModeCommandTopic,
      value_template: `{% set val = value_json['${svc.addr}'].params['17'] | default('0') %}{{ {'0': 'Off', '1': 'Home Alarm Mode', '2': 'Away Alarm Mode'}.get(val, 'Off') }}`,
    };

    commandHandlers[alarmModeCommandTopic] = async (payload: string) => {
      const valueMap: Record<string, string> = {
        Off: '0',
        'Home Alarm Mode': '1',
        'Away Alarm Mode': '2',
      };

      const value = valueMap[payload];
      if (!value) return;

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.set',
        val_t: 'str_map',
        val: {
          parameter_id: '17',
          value: value,
        },
      });
    };

    // Part of Alarm System (Parameter ID 18)
    const alarmSystemCommandTopic = `${topicPrefix}${svc.addr}/alarm_system/command`;

    components[`${svc.addr}_alarm_system`] = {
      unique_id: `${svc.addr}_alarm_system`,
      platform: 'switch',
      name: 'Part of Alarm System',
      entity_category: 'config',
      command_topic: alarmSystemCommandTopic,
      value_template: `{{ (value_json['${svc.addr}'].params['18'] | default('1') == '1') | iif('ON', 'OFF') }}`,
    };

    commandHandlers[alarmSystemCommandTopic] = async (payload: string) => {
      const value = payload === 'ON' ? '1' : '0';

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.set',
        val_t: 'str_map',
        val: {
          parameter_id: '18',
          value: value,
        },
      });
    };

    // User Code Blocking (Parameter ID 19)
    const codeBlockingCommandTopic = `${topicPrefix}${svc.addr}/code_blocking/command`;

    components[`${svc.addr}_code_blocking`] = {
      unique_id: `${svc.addr}_code_blocking`,
      platform: 'switch',
      name: 'User Code Blocking',
      entity_category: 'config',
      command_topic: codeBlockingCommandTopic,
      value_template: `{{ (value_json['${svc.addr}'].params['19'] | default('0') == '1') | iif('ON', 'OFF') }}`,
    };

    commandHandlers[codeBlockingCommandTopic] = async (payload: string) => {
      const value = payload === 'ON' ? '1' : '0';

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.set',
        val_t: 'str_map',
        val: {
          parameter_id: '19',
          value: value,
        },
      });
    };

    // System Arm Hold Time (Parameter ID 16) - Number input in milliseconds
    const armHoldTimeCommandTopic = `${topicPrefix}${svc.addr}/arm_hold_time/command`;

    components[`${svc.addr}_arm_hold_time`] = {
      unique_id: `${svc.addr}_arm_hold_time`,
      platform: 'number',
      name: 'System Arm Hold Time',
      entity_category: 'config',
      unit_of_measurement: 'ms',
      min: 1000,
      max: 20000,
      step: 100,
      command_topic: armHoldTimeCommandTopic,
      value_template: `{{ value_json['${svc.addr}'].params['16'] | default(3000) | int }}`,
    };

    commandHandlers[armHoldTimeCommandTopic] = async (payload: string) => {
      const value = parseInt(payload, 10);
      if (isNaN(value) || value < 1000 || value > 20000) return;

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_param.set',
        val_t: 'str_map',
        val: {
          parameter_id: '16',
          value: value.toString(),
        },
      });
    };
  }

  // Activity sensor - shows last activity
  if (svc.intf?.includes('evt.doorman_activity.report')) {
    components[`${svc.addr}_last_activity`] = {
      unique_id: `${svc.addr}_last_activity`,
      platform: 'sensor',
      name: 'Last Activity',
      entity_category: 'diagnostic',
      icon: 'mdi:history',
      value_template: `{% set activity = value_json['${svc.addr}'].activity %}{% if activity %}{{ activity.event_type | default('unknown') }}{% else %}unknown{% endif %}`,
    };

    // Activity details as attributes sensor
    components[`${svc.addr}_activity_details`] = {
      unique_id: `${svc.addr}_activity_details`,
      platform: 'sensor',
      name: 'Activity Details',
      entity_category: 'diagnostic',
      icon: 'mdi:information',
      value_template: `{% set activity = value_json['${svc.addr}'].activity %}{% if activity %}{{ activity | tojson }}{% else %}{}{% endif %}`,
    };
  }

  // User management functions - these would typically be handled through automations or scripts
  // But we can expose basic clear user functionality
  if (svc.intf?.includes('cmd.doorman_user.clear')) {
    // We'll create a text input for slot number to clear
    const clearUserCommandTopic = `${topicPrefix}${svc.addr}/clear_user/command`;

    components[`${svc.addr}_clear_user_slot`] = {
      unique_id: `${svc.addr}_clear_user_slot`,
      platform: 'text',
      name: 'Clear User Slot',
      entity_category: 'config',
      command_topic: clearUserCommandTopic,
      min: 1,
      max: 2,
      pattern: '^[0-9]{1,2}$',
    };

    commandHandlers[clearUserCommandTopic] = async (payload: string) => {
      const slotNumber = parseInt(payload, 10);
      if (isNaN(slotNumber) || slotNumber < 0 || slotNumber > 20) return;

      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman_user.clear',
        val_t: 'str_map',
        val: {
          slot_number: slotNumber.toString(),
        },
      });
    };
  }

  // Integration command support
  if (svc.intf?.includes('cmd.doorman.integration')) {
    // This is typically handled automatically by the hub, but we can expose manual trigger
    const integrationCommandTopic = `${topicPrefix}${svc.addr}/start_integration/command`;

    components[`${svc.addr}_start_integration`] = {
      unique_id: `${svc.addr}_start_integration`,
      platform: 'button',
      name: 'Start Integration',
      entity_category: 'config',
      device_class: 'restart',
      command_topic: integrationCommandTopic,
    };

    commandHandlers[integrationCommandTopic] = async (_payload: string) => {
      // Start integration with default PIN code (this should be customized)
      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman.integration',
        val_t: 'str_map',
        val: {
          slot_number: '0',
          code_type: 'pin',
          code: '123456', // Default code - should be configurable
        },
      });
    };
  }

  // Arm confirmation support
  if (svc.intf?.includes('cmd.doorman.arm_confirm')) {
    const armConfirmCommandTopic = `${topicPrefix}${svc.addr}/arm_confirm/command`;

    components[`${svc.addr}_arm_confirm`] = {
      unique_id: `${svc.addr}_arm_confirm`,
      platform: 'button',
      name: 'Arm Confirm',
      entity_category: 'config',
      command_topic: armConfirmCommandTopic,
    };

    commandHandlers[armConfirmCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'doorman',
        cmd: 'cmd.doorman.arm_confirm',
        val_t: 'str_map',
        val: {
          sequence_number: '0',
          operating_parameter: '0',
        },
      });
    };
  }

  return {
    components,
    commandHandlers,
  };
}
