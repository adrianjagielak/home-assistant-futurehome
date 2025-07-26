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

export function _alarm__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  for (const event of svc.props?.sup_events ?? []) {
    const device_class =
      (
        {
          // --- alarm_appliance ---
          program_started: 'running',
          program_inprogress: 'running',
          program_completed: 'update',
          replace_filter: 'problem',
          set_temp_error: 'problem',
          supplying_water: 'power',
          water_supply_err: 'problem',
          boiling: 'heat',
          boiling_err: 'problem',
          washing: 'running',
          washing_err: 'problem',
          rinsing: 'running',
          rinsing_err: 'problem',
          draining: 'running',
          draining_err: 'problem',
          spinning: 'running',
          spinning_err: 'problem',
          drying: 'running',
          drying_err: 'problem',
          fan_err: 'problem',
          compressor_err: 'problem',

          // --- alarm_burglar ---
          intrusion: 'motion',
          tamper_removed_cover: 'tamper',
          tamper_invalid_code: 'tamper',
          tamper_force_open: 'tamper',
          alarm_burglar: 'motion',
          glass_breakage: 'problem',

          // --- alarm_emergency ---
          police: 'safety',
          fire: 'smoke',
          medical: 'safety',

          // --- alarm_fire ---
          smoke: 'smoke',
          smoke_test: 'smoke',

          // --- alarm_gas ---
          CO: 'carbon_monoxide',
          CO2: 'gas',
          combust_gas_detected: 'gas',
          toxic_gas_detected: 'gas',
          test: 'safety',
          replace: 'update',

          // --- alarm_health ---
          leaving_bed: 'occupancy',
          sitting_on_bed: 'occupancy',
          lying_on_bed: 'occupancy',
          posture_change: 'occupancy',
          sitting_on_bed_edge: 'occupancy',
          alarm_health: 'safety',
          volatile_organic_compound: 'gas',

          // --- alarm_heat ---
          overheat: 'heat',
          temp_rise: 'heat',
          underheat: 'cold',
          window_opened: 'window',

          // --- alarm_lock ---
          manual_lock: 'lock',
          manual_unlock: 'lock',
          rf_lock: 'lock',
          rf_unlock: 'lock',
          keypad_lock: 'lock',
          keypad_unlock: 'lock',
          tag_lock: 'lock',
          tag_unlock: 'lock',
          manual_not_locked: 'lock',
          rf_not_locked: 'lock',
          auto_locked: 'lock',
          jammed: 'lock',
          door_opened: 'door',
          door_closed: 'door',
          lock_failed: 'lock',

          // --- alarm_power ---
          on: 'power',
          ac_on: 'power',
          ac_off: 'power',
          surge: 'power',
          voltage_drop: 'power',
          over_current: 'power',
          over_voltage: 'power',
          replace_soon: 'battery',
          replace_now: 'battery',
          charging: 'battery_charging',
          charged: 'battery',
          charge_soon: 'battery',
          charge_now: 'battery',

          // --- alarm_siren ---
          inactive: 'problem',
          siren_active: 'sound',

          // --- alarm_system ---
          hw_failure: 'problem',
          sw_failure: 'problem',
          hw_failure_with_code: 'problem',
          sw_failure_with_code: 'problem',

          // --- alarm_time ---
          wakeup: 'safety',
          timer_ended: 'update',
          time_remaining: 'update',

          // --- alarm_water_valve ---
          valve_op: 'opening',
          master_valve_op: 'opening',
          valve_short_circuit: 'problem',
          current_alarm: 'problem',
          alarm_water_valve: 'problem',
          master_valve_current_alarm: 'problem',

          // --- alarm_water ---
          leak: 'moisture',
          level_drop: 'moisture',

          // --- alarm_weather ---
          moisture: 'moisture',
        } as { [key: string]: BinarySensorDeviceClass }
      )[event] ?? 'safety';

    const name = (
      {
        // --- alarm_appliance ---
        program_started: 'Program Started',
        program_inprogress: 'Program In Progress',
        program_completed: 'Program Completed',
        replace_filter: 'Filter Replacement Needed',
        set_temp_error: 'Temperature Setting Error',
        supplying_water: 'Supplying Water',
        water_supply_err: 'Water Supply Error',
        boiling: 'Boiling',
        boiling_err: 'Boiling Error',
        washing: 'Washing',
        washing_err: 'Washing Error',
        rinsing: 'Rinsing',
        rinsing_err: 'Rinsing Error',
        draining: 'Draining',
        draining_err: 'Draining Error',
        spinning: 'Spinning',
        spinning_err: 'Spinning Error',
        drying: 'Drying',
        drying_err: 'Drying Error',
        fan_err: 'Fan Error',
        compressor_err: 'Compressor Error',

        // --- alarm_burglar ---
        intrusion: 'Intrusion Alarm',
        tamper_removed_cover: 'Tamper Alarm',
        tamper_invalid_code: 'Tamper Alarm',
        tamper_force_open: 'Tamper Alarm',
        alarm_burglar: 'Burglar Alarm',
        glass_breakage: 'Glass Breakage Alarm',

        // --- alarm_emergency ---
        police: 'Police Alarm',
        fire: 'Fire Alarm',
        medical: 'Medical Alarm',

        // --- alarm_fire ---
        smoke: undefined, // maps 1:1 to device_class smoke
        smoke_test: 'Smoke Test Alarm',

        // --- alarm_gas ---
        CO: undefined, // maps 1:1 to carbon_monoxide
        CO2: 'CO₂ Alarm',
        combust_gas_detected: 'Combustible Gas Alarm',
        toxic_gas_detected: 'Toxic Gas Alarm',
        test: 'Gas Test Alarm',
        replace: 'Gas Sensor Replace',

        // --- alarm_health ---
        leaving_bed: 'Leaving Bed',
        sitting_on_bed: 'Sitting on Bed',
        lying_on_bed: 'Lying on Bed',
        posture_change: 'Posture Change',
        sitting_on_bed_edge: 'Sitting on Bed Edge',
        alarm_health: 'Health Alarm',
        volatile_organic_compound: 'VOC Alarm',

        // --- alarm_heat ---
        overheat: 'Overheat Alarm',
        temp_rise: 'Temperature Rise Alarm',
        underheat: 'Underheat Alarm',
        window_opened: 'Window Opened',

        // --- alarm_lock ---
        manual_lock: 'Manual Lock',
        manual_unlock: 'Manual Unlock',
        rf_lock: 'RF Lock',
        rf_unlock: 'RF Unlock',
        keypad_lock: 'Keypad Lock',
        keypad_unlock: 'Keypad Unlock',
        tag_lock: 'Tag Lock',
        tag_unlock: 'Tag Unlock',
        manual_not_locked: 'Manual Not Locked',
        rf_not_locked: 'RF Not Locked',
        auto_locked: 'Auto Locked',
        jammed: 'Lock Jammed',
        door_opened: 'Door Opened',
        door_closed: 'Door Closed',
        lock_failed: 'Lock Failed',

        // --- alarm_power ---
        on: 'Power On',
        ac_on: 'AC Power On',
        ac_off: 'AC Power Off',
        surge: 'Power Surge',
        voltage_drop: 'Voltage Drop',
        over_current: 'Over Current Alarm',
        over_voltage: 'Over Voltage Alarm',
        replace_soon: 'Battery Replace Soon',
        replace_now: 'Battery Replace Now',
        charging: undefined, // battery_charging
        charged: undefined, // battery
        charge_soon: 'Charge Soon',
        charge_now: 'Charge Now',

        // --- alarm_siren ---
        inactive: 'Siren Inactive',
        siren_active: 'Siren Active',

        // --- alarm_system ---
        hw_failure: 'Hardware Failure',
        sw_failure: 'Software Failure',
        hw_failure_with_code: 'Hardware Failure (Code)',
        sw_failure_with_code: 'Software Failure (Code)',

        // --- alarm_time ---
        wakeup: 'Wake Up',
        timer_ended: 'Timer Ended',
        time_remaining: 'Time Remaining',

        // --- alarm_water_valve ---
        valve_op: 'Valve Operation',
        master_valve_op: 'Master Valve Operation',
        valve_short_circuit: 'Valve Short Circuit',
        current_alarm: 'Valve Current Alarm',
        alarm_water_valve: 'Water Valve Alarm',
        master_valve_current_alarm: 'Master Valve Current Alarm',

        // --- alarm_water ---
        leak: undefined, // maps 1:1 to moisture
        level_drop: 'Water Level Drop',

        // --- alarm_weather ---
        moisture: undefined, // maps 1:1 to moisture
      } as { [key: string]: string | undefined }
    )[event];

    components[`${svc.addr}_${event}_sensor`] = {
      unique_id: `${svc.addr}_${event}_sensor`,
      platform: 'binary_sensor',
      device_class: device_class,
      name: name,
      value_template: `{{ (value_json['${svc.addr}'].alarm.${event}.status == 'activ') | iif('ON', 'OFF') }}`,
    };

    if (svc.intf?.includes('cmd.alarm.clear')) {
      const clearCmdTopic = `${topicPrefix}${svc.addr}/${event}_clear/command`;

      components[`${svc.addr}_${event}_clear`] = {
        unique_id: `${svc.addr}_${event}_clear`,
        platform: 'button',
        command_topic: clearCmdTopic,
        name: `Clear ${event} alarm`,
        icon: 'mdi:alarm-light-off',
      };

      commandHandlers[clearCmdTopic] = async (_payload) => {
        await sendFimpMsg({
          address: svc.addr!,
          service: svcName,
          cmd: 'cmd.alarm.clear',
          val: event,
          val_t: 'string',
        });
      };
    }
  }

  return {
    components,
    commandHandlers,
  };
}
