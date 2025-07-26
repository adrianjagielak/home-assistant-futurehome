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

interface ScheduleEntry {
  slot: number;
  user_id: number;
  year_start?: number;
  month_start?: number;
  day_start?: number;
  hour_start?: number;
  minute_start?: number;
  year_end?: number;
  month_end?: number;
  day_end?: number;
  hour_end?: number;
  minute_end?: number;
}

export function schedule_entry__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  const slots = svc.props?.slots || 1;

  // For each slot, create management controls
  for (let slot = 1; slot <= slots; slot++) {
    const slotPrefix = `${svc.addr}_slot_${slot}`;

    // User ID selector for this slot
    const userIdCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/user_id/command`;
    components[`${slotPrefix}_user_id`] = {
      unique_id: `${slotPrefix}_user_id`,
      platform: 'number',
      name: `Schedule Slot ${slot} User ID`,
      entity_category: 'config',
      min: 1,
      max: 254, // Typical user code range
      step: 1,
      mode: 'box',
      command_topic: userIdCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.user_id }}{% endif %}{% endfor %}`,
      icon: 'mdi:account-key',
    };

    // Year start selector
    const yearStartCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/year_start/command`;
    components[`${slotPrefix}_year_start`] = {
      unique_id: `${slotPrefix}_year_start`,
      platform: 'number',
      name: `Schedule Slot ${slot} Start Year`,
      entity_category: 'config',
      min: 0,
      max: 99,
      step: 1,
      mode: 'box',
      command_topic: yearStartCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.year_start | default(0) }}{% endif %}{% endfor %}`,
      icon: 'mdi:calendar-start',
    };

    // Month start selector
    const monthStartCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/month_start/command`;
    components[`${slotPrefix}_month_start`] = {
      unique_id: `${slotPrefix}_month_start`,
      platform: 'number',
      name: `Schedule Slot ${slot} Start Month`,
      entity_category: 'config',
      min: 1,
      max: 12,
      step: 1,
      mode: 'box',
      command_topic: monthStartCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.month_start | default(1) }}{% endif %}{% endfor %}`,
      icon: 'mdi:calendar-month',
    };

    // Day start selector
    const dayStartCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/day_start/command`;
    components[`${slotPrefix}_day_start`] = {
      unique_id: `${slotPrefix}_day_start`,
      platform: 'number',
      name: `Schedule Slot ${slot} Start Day`,
      entity_category: 'config',
      min: 1,
      max: 31,
      step: 1,
      mode: 'box',
      command_topic: dayStartCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.day_start | default(1) }}{% endif %}{% endfor %}`,
      icon: 'mdi:calendar-today',
    };

    // Hour start selector
    const hourStartCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/hour_start/command`;
    components[`${slotPrefix}_hour_start`] = {
      unique_id: `${slotPrefix}_hour_start`,
      platform: 'number',
      name: `Schedule Slot ${slot} Start Hour`,
      entity_category: 'config',
      min: 0,
      max: 23,
      step: 1,
      mode: 'box',
      command_topic: hourStartCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.hour_start | default(0) }}{% endif %}{% endfor %}`,
      icon: 'mdi:clock-start',
    };

    // Minute start selector
    const minuteStartCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/minute_start/command`;
    components[`${slotPrefix}_minute_start`] = {
      unique_id: `${slotPrefix}_minute_start`,
      platform: 'number',
      name: `Schedule Slot ${slot} Start Minute`,
      entity_category: 'config',
      min: 0,
      max: 59,
      step: 1,
      mode: 'box',
      command_topic: minuteStartCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.minute_start | default(0) }}{% endif %}{% endfor %}`,
      icon: 'mdi:clock-start',
    };

    // Year end selector
    const yearEndCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/year_end/command`;
    components[`${slotPrefix}_year_end`] = {
      unique_id: `${slotPrefix}_year_end`,
      platform: 'number',
      name: `Schedule Slot ${slot} End Year`,
      entity_category: 'config',
      min: 0,
      max: 99,
      step: 1,
      mode: 'box',
      command_topic: yearEndCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.year_end | default(99) }}{% endif %}{% endfor %}`,
      icon: 'mdi:calendar-end',
    };

    // Month end selector
    const monthEndCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/month_end/command`;
    components[`${slotPrefix}_month_end`] = {
      unique_id: `${slotPrefix}_month_end`,
      platform: 'number',
      name: `Schedule Slot ${slot} End Month`,
      entity_category: 'config',
      min: 1,
      max: 12,
      step: 1,
      mode: 'box',
      command_topic: monthEndCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.month_end | default(12) }}{% endif %}{% endfor %}`,
      icon: 'mdi:calendar-month',
    };

    // Day end selector
    const dayEndCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/day_end/command`;
    components[`${slotPrefix}_day_end`] = {
      unique_id: `${slotPrefix}_day_end`,
      platform: 'number',
      name: `Schedule Slot ${slot} End Day`,
      entity_category: 'config',
      min: 1,
      max: 31,
      step: 1,
      mode: 'box',
      command_topic: dayEndCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.day_end | default(31) }}{% endif %}{% endfor %}`,
      icon: 'mdi:calendar-today',
    };

    // Hour end selector
    const hourEndCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/hour_end/command`;
    components[`${slotPrefix}_hour_end`] = {
      unique_id: `${slotPrefix}_hour_end`,
      platform: 'number',
      name: `Schedule Slot ${slot} End Hour`,
      entity_category: 'config',
      min: 0,
      max: 23,
      step: 1,
      mode: 'box',
      command_topic: hourEndCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.hour_end | default(23) }}{% endif %}{% endfor %}`,
      icon: 'mdi:clock-end',
    };

    // Minute end selector
    const minuteEndCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/minute_end/command`;
    components[`${slotPrefix}_minute_end`] = {
      unique_id: `${slotPrefix}_minute_end`,
      platform: 'number',
      name: `Schedule Slot ${slot} End Minute`,
      entity_category: 'config',
      min: 0,
      max: 59,
      step: 1,
      mode: 'box',
      command_topic: minuteEndCommandTopic,
      optimistic: false,
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} %}{{ entry.minute_end | default(59) }}{% endif %}{% endfor %}`,
      icon: 'mdi:clock-end',
    };

    // Clear schedule button for this slot
    const clearCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/clear/command`;
    components[`${slotPrefix}_clear`] = {
      unique_id: `${slotPrefix}_clear`,
      platform: 'button',
      name: `Clear Schedule Slot ${slot}`,
      entity_category: 'config',
      command_topic: clearCommandTopic,
      icon: 'mdi:delete-sweep',
    };

    // Get report button for this slot
    const getReportCommandTopic = `${topicPrefix}${svc.addr}/slot_${slot}/get_report/command`;
    components[`${slotPrefix}_get_report`] = {
      unique_id: `${slotPrefix}_get_report`,
      platform: 'button',
      name: `Get Schedule Slot ${slot} Report`,
      entity_category: 'diagnostic',
      command_topic: getReportCommandTopic,
      icon: 'mdi:file-document-outline',
    };

    // Schedule active sensor for this slot
    components[`${slotPrefix}_active`] = {
      unique_id: `${slotPrefix}_active`,
      platform: 'binary_sensor',
      name: `Schedule Slot ${slot} Active`,
      entity_category: 'diagnostic',
      device_class: 'connectivity',
      value_template: `{% set entries = value_json['${svc.addr}'] %}{% set found = false %}{% for key, entry in entries.items() %}{% if entry.slot == ${slot} and entry.year_start is defined %}{% set found = true %}{% endif %}{% endfor %}{{ found | iif('ON', 'OFF') }}`,
      icon: 'mdi:calendar-clock',
    };

    // Command handlers for this slot

    // Helper function to get current schedule entry for a slot
    const getCurrentScheduleEntry = async (
      slotNum: number,
    ): Promise<ScheduleEntry | null> => {
      // This would need to be implemented to get the current state from the cached state
      // For now, we'll construct a basic entry with required fields
      return {
        slot: slotNum,
        user_id: 1, // Default user ID
      };
    };

    // Helper function to update a schedule entry field
    const updateScheduleField = async (
      slotNum: number,
      field: keyof ScheduleEntry,
      value: number,
    ) => {
      const currentEntry = await getCurrentScheduleEntry(slotNum);
      if (!currentEntry) return;

      const updatedEntry: ScheduleEntry = {
        ...currentEntry,
        [field]: value,
      };

      // Only send the set command if we have minimum required fields
      if (updatedEntry.user_id && updatedEntry.slot) {
        await sendFimpMsg({
          address: svc.addr,
          service: 'schedule_entry',
          cmd: 'cmd.schedule_entry.set',
          val_t: 'int_map',
          val: updatedEntry,
        });
      }
    };

    // User ID command handler
    commandHandlers[userIdCommandTopic] = async (payload: string) => {
      const userId = parseInt(payload, 10);
      if (Number.isNaN(userId) || userId < 1 || userId > 254) {
        return;
      }
      await updateScheduleField(slot, 'user_id', userId);
    };

    // Year start command handler
    commandHandlers[yearStartCommandTopic] = async (payload: string) => {
      const year = parseInt(payload, 10);
      if (Number.isNaN(year) || year < 0 || year > 99) {
        return;
      }
      await updateScheduleField(slot, 'year_start', year);
    };

    // Month start command handler
    commandHandlers[monthStartCommandTopic] = async (payload: string) => {
      const month = parseInt(payload, 10);
      if (Number.isNaN(month) || month < 1 || month > 12) {
        return;
      }
      await updateScheduleField(slot, 'month_start', month);
    };

    // Day start command handler
    commandHandlers[dayStartCommandTopic] = async (payload: string) => {
      const day = parseInt(payload, 10);
      if (Number.isNaN(day) || day < 1 || day > 31) {
        return;
      }
      await updateScheduleField(slot, 'day_start', day);
    };

    // Hour start command handler
    commandHandlers[hourStartCommandTopic] = async (payload: string) => {
      const hour = parseInt(payload, 10);
      if (Number.isNaN(hour) || hour < 0 || hour > 23) {
        return;
      }
      await updateScheduleField(slot, 'hour_start', hour);
    };

    // Minute start command handler
    commandHandlers[minuteStartCommandTopic] = async (payload: string) => {
      const minute = parseInt(payload, 10);
      if (Number.isNaN(minute) || minute < 0 || minute > 59) {
        return;
      }
      await updateScheduleField(slot, 'minute_start', minute);
    };

    // Year end command handler
    commandHandlers[yearEndCommandTopic] = async (payload: string) => {
      const year = parseInt(payload, 10);
      if (Number.isNaN(year) || year < 0 || year > 99) {
        return;
      }
      await updateScheduleField(slot, 'year_end', year);
    };

    // Month end command handler
    commandHandlers[monthEndCommandTopic] = async (payload: string) => {
      const month = parseInt(payload, 10);
      if (Number.isNaN(month) || month < 1 || month > 12) {
        return;
      }
      await updateScheduleField(slot, 'month_end', month);
    };

    // Day end command handler
    commandHandlers[dayEndCommandTopic] = async (payload: string) => {
      const day = parseInt(payload, 10);
      if (Number.isNaN(day) || day < 1 || day > 31) {
        return;
      }
      await updateScheduleField(slot, 'day_end', day);
    };

    // Hour end command handler
    commandHandlers[hourEndCommandTopic] = async (payload: string) => {
      const hour = parseInt(payload, 10);
      if (Number.isNaN(hour) || hour < 0 || hour > 23) {
        return;
      }
      await updateScheduleField(slot, 'hour_end', hour);
    };

    // Minute end command handler
    commandHandlers[minuteEndCommandTopic] = async (payload: string) => {
      const minute = parseInt(payload, 10);
      if (Number.isNaN(minute) || minute < 0 || minute > 59) {
        return;
      }
      await updateScheduleField(slot, 'minute_end', minute);
    };

    // Clear command handler
    commandHandlers[clearCommandTopic] = async (_payload: string) => {
      const currentEntry = await getCurrentScheduleEntry(slot);
      if (!currentEntry) return;

      await sendFimpMsg({
        address: svc.addr,
        service: 'schedule_entry',
        cmd: 'cmd.schedule_entry.clear',
        val_t: 'int_map',
        val: {
          slot: slot,
          user_id: currentEntry.user_id,
        },
      });
    };

    // Get report command handler
    commandHandlers[getReportCommandTopic] = async (_payload: string) => {
      const currentEntry = await getCurrentScheduleEntry(slot);
      if (!currentEntry) return;

      await sendFimpMsg({
        address: svc.addr,
        service: 'schedule_entry',
        cmd: 'cmd.schedule_entry.get_report',
        val_t: 'int_map',
        val: {
          slot: slot,
          user_id: currentEntry.user_id,
        },
      });
    };
  }

  // Global schedule sensor showing total active schedules
  components[`${svc.addr}_total_active`] = {
    unique_id: `${svc.addr}_total_active`,
    platform: 'sensor',
    name: 'Active Schedule Count',
    entity_category: 'diagnostic',
    state_class: 'measurement',
    value_template: `{% set entries = value_json['${svc.addr}'] %}{% set count = 0 %}{% for key, entry in entries.items() %}{% if entry.year_start is defined %}{% set count = count + 1 %}{% endif %}{% endfor %}{{ count }}`,
    icon: 'mdi:calendar-check',
  };

  return {
    components,
    commandHandlers,
  };
}
