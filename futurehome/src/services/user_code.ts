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

export function user_code__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Extract supported properties
  const supUsercodes = svc.props?.sup_usercodes || [];
  const supUserstatus = svc.props?.sup_userstatus || [];
  const supUsertypes = svc.props?.sup_usertypes || [];
  const supUsers = svc.props?.sup_users || 10;
  const minCodeLength = svc.props?.min_code_length || 4;
  const maxCodeLength = svc.props?.max_code_length || 8;

  // Create sensors for user code configuration and status
  if (svc.intf?.includes('evt.usercode.users_report')) {
    // Create a sensor to show the number of configured users
    components[`${svc.addr}_user_count`] = {
      unique_id: `${svc.addr}_user_count`,
      platform: 'sensor',
      entity_category: 'diagnostic',
      name: 'User Count',
      icon: 'mdi:account-multiple',
      value_template: `{% set users = value_json['${svc.addr}'].users %}{% if users %}{{ users.pin | length + (users.rfid | length if users.rfid else 0) }}{% else %}0{% endif %}`,
    };

    // Create a sensor to show supported user codes types
    if (supUsercodes.length > 0) {
      components[`${svc.addr}_supported_types`] = {
        unique_id: `${svc.addr}_supported_types`,
        platform: 'sensor',
        entity_category: 'diagnostic',
        name: 'Supported Code Types',
        icon: 'mdi:key-variant',
        value_template: `{{ '${supUsercodes.join(', ')}' }}`,
      };
    }

    // Create a sensor to show max users
    components[`${svc.addr}_max_users`] = {
      unique_id: `${svc.addr}_max_users`,
      platform: 'sensor',
      entity_category: 'diagnostic',
      name: 'Max Users',
      icon: 'mdi:account-group',
      value_template: `{{ ${supUsers} }}`,
    };
  }

  // Create binary sensor for access reports (if supported)
  if (svc.intf?.includes('evt.usercode.access_report')) {
    components[`${svc.addr}_access_granted`] = {
      unique_id: `${svc.addr}_access_granted`,
      platform: 'binary_sensor',
      device_class: 'lock',
      name: 'Access Granted',
      value_template: `{{ (value_json['${svc.addr}'].access_report.permission == 'granted') | iif('ON', 'OFF') }}`,
    };

    // Create sensor for last access event details
    components[`${svc.addr}_last_access`] = {
      unique_id: `${svc.addr}_last_access`,
      platform: 'sensor',
      name: 'Last Access',
      icon: 'mdi:account-clock',
      value_template: `{% set access = value_json['${svc.addr}'].access_report %}{% if access %}{{ access.event | default('unknown') }} by {{ access.alias | default('unknown') }} ({{ access.identification | default('unknown') }}){% else %}No access{% endif %}`,
    };
  }

  // Create button for clearing all users (if supported)
  if (svc.intf?.includes('cmd.usercode.clear_all')) {
    const clearAllTopic = `${topicPrefix}${svc.addr}/clear_all/command`;

    components[`${svc.addr}_clear_all`] = {
      unique_id: `${svc.addr}_clear_all`,
      platform: 'button',
      entity_category: 'config',
      device_class: null,
      name: 'Clear All Users',
      icon: 'mdi:account-remove',
      command_topic: clearAllTopic,
    };

    commandHandlers[clearAllTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'user_code',
        cmd: 'cmd.usercode.clear_all',
        val_t: 'null',
        val: null,
      });
    };
  }

  // Create button for requesting user list (if supported)
  if (svc.intf?.includes('cmd.usercode.get')) {
    const getUsersTopic = `${topicPrefix}${svc.addr}/get_users/command`;

    components[`${svc.addr}_get_users`] = {
      unique_id: `${svc.addr}_get_users`,
      platform: 'button',
      entity_category: 'diagnostic',
      device_class: null,
      name: 'Refresh Users',
      icon: 'mdi:account-search',
      command_topic: getUsersTopic,
    };

    commandHandlers[getUsersTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'user_code',
        cmd: 'cmd.usercode.get',
        val_t: 'str_map',
        val: {},
      });
    };
  }

  // Create text inputs for user management (if supported)
  if (svc.intf?.includes('cmd.usercode.set')) {
    // Text input for adding PIN users
    if (supUsercodes.includes('pin')) {
      const addPinUserTopic = `${topicPrefix}${svc.addr}/add_pin_user/command`;

      components[`${svc.addr}_add_pin_user`] = {
        unique_id: `${svc.addr}_add_pin_user`,
        platform: 'text',
        entity_category: 'config',
        name: 'Add PIN User (slot:alias:code)',
        icon: 'mdi:account-plus',
        min: minCodeLength + 4, // minimum: "1:a:1234"
        max: maxCodeLength + 20, // reasonable max including slot and alias
        command_topic: addPinUserTopic,
      };

      commandHandlers[addPinUserTopic] = async (payload: string) => {
        // Expected format: "slot:alias:code" e.g., "1:John:1234"
        const parts = payload.split(':');
        if (parts.length !== 3) {
          return;
        }

        const [slot, alias, code] = parts;
        if (!slot || !alias || !code) {
          return;
        }

        const slotNum = parseInt(slot, 10);
        if (Number.isNaN(slotNum) || slotNum < 1 || slotNum > supUsers) {
          return;
        }

        if (code.length < minCodeLength || code.length > maxCodeLength) {
          return;
        }

        await sendFimpMsg({
          address: svc.addr,
          service: 'user_code',
          cmd: 'cmd.usercode.set',
          val_t: 'str_map',
          val: {
            id_type: 'pin',
            slot: slot,
            alias: alias,
            code: code,
            user_status: supUserstatus.includes('enabled')
              ? 'enabled'
              : supUserstatus[0] || 'enabled',
            user_type: supUsertypes.includes('normal')
              ? 'normal'
              : supUsertypes[0] || 'normal',
          },
        });
      };
    }

    // Text input for adding RFID users
    if (supUsercodes.includes('rfid')) {
      const addRfidUserTopic = `${topicPrefix}${svc.addr}/add_rfid_user/command`;

      components[`${svc.addr}_add_rfid_user`] = {
        unique_id: `${svc.addr}_add_rfid_user`,
        platform: 'text',
        entity_category: 'config',
        name: 'Add RFID User (slot:alias:code)',
        icon: 'mdi:account-plus',
        min: 6, // minimum: "1:a:xx"
        max: 50, // reasonable max for RFID codes
        command_topic: addRfidUserTopic,
      };

      commandHandlers[addRfidUserTopic] = async (payload: string) => {
        // Expected format: "slot:alias:code" e.g., "1:John:ABCD1234"
        const parts = payload.split(':');
        if (parts.length !== 3) {
          return;
        }

        const [slot, alias, code] = parts;
        if (!slot || !alias || !code) {
          return;
        }

        const slotNum = parseInt(slot, 10);
        if (Number.isNaN(slotNum) || slotNum < 1 || slotNum > supUsers) {
          return;
        }

        await sendFimpMsg({
          address: svc.addr,
          service: 'user_code',
          cmd: 'cmd.usercode.set',
          val_t: 'str_map',
          val: {
            id_type: 'rfid',
            slot: slot,
            alias: alias,
            code: code,
            user_status: supUserstatus.includes('enabled')
              ? 'enabled'
              : supUserstatus[0] || 'enabled',
            user_type: supUsertypes.includes('normal')
              ? 'normal'
              : supUsertypes[0] || 'normal',
          },
        });
      };
    }
  }

  // Create text input for removing users (if supported)
  if (svc.intf?.includes('cmd.usercode.clear')) {
    const clearUserTopic = `${topicPrefix}${svc.addr}/clear_user/command`;

    components[`${svc.addr}_clear_user`] = {
      unique_id: `${svc.addr}_clear_user`,
      platform: 'text',
      entity_category: 'config',
      name: 'Clear User (type:slot)',
      icon: 'mdi:account-minus',
      min: 5, // minimum: "pin:1"
      max: 10, // maximum: "rfid:999"
      command_topic: clearUserTopic,
    };

    commandHandlers[clearUserTopic] = async (payload: string) => {
      // Expected format: "type:slot" e.g., "pin:1" or "rfid:2"
      const parts = payload.split(':');
      if (parts.length !== 2) {
        return;
      }

      const [idType, slot] = parts;
      if (!idType || !slot) {
        return;
      }

      if (!supUsercodes.includes(idType)) {
        return;
      }

      const slotNum = parseInt(slot, 10);
      if (Number.isNaN(slotNum) || slotNum < 1 || slotNum > supUsers) {
        return;
      }

      await sendFimpMsg({
        address: svc.addr,
        service: 'user_code',
        cmd: 'cmd.usercode.clear',
        val_t: 'str_map',
        val: {
          id_type: idType,
          slot: slot,
        },
      });
    };
  }

  // Create sensor for configuration reports (if supported)
  if (svc.intf?.includes('evt.usercode.config_report')) {
    components[`${svc.addr}_config_status`] = {
      unique_id: `${svc.addr}_config_status`,
      platform: 'sensor',
      name: 'Configuration Status',
      icon: 'mdi:cog',
      value_template: `{% set config = value_json['${svc.addr}'].config_report %}{% if config %}{{ config.event | default('unknown') }} - Slot {{ config.slot | default('?') }} ({{ config.alias | default('unknown') }}){% else %}No recent changes{% endif %}`,
    };
  }

  return {
    components,
    commandHandlers,
  };
}
