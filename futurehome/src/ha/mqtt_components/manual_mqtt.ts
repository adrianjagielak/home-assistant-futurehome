import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT manual alarm control panel component for Home Assistant MQTT Discovery.
 *
 * The `manual_mqtt` alarm control panel platform extends the [manual alarm](https://www.home-assistant.io/integrations/manual)
 * by adding support for MQTT control of the alarm by a remote device. It can be used to create external keypads which simply change the state of
 * the manual alarm in Home Assistant.
 *
 * It's essentially the opposite of the [MQTT Alarm Panel](https://www.home-assistant.io/integrations/alarm_control_panel.mqtt/)
 * which allows Home Assistant to observe an existing, fully-featured alarm where all of the alarm logic is embedded in that physical device.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/manual_mqtt.mqtt/
 */
export interface ManualMqttComponent extends BaseComponent {
  /**
   * Must be `button`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'manual_mqtt';

  /**
   * The MQTT topic Home Assistant will publish state updates to.
   * This topic is where Home Assistant will publish the current state of the alarm.
   *
   * Required.
   */
  state_topic: string;

  /**
   * The MQTT topic Home Assistant will subscribe to, to receive commands from a remote device to change the alarm state.
   * Commands accepted are:
   * - "DISARM"
   * - "ARM_HOME"
   * - "ARM_AWAY"
   * - "ARM_NIGHT"
   * - "ARM_VACATION"
   * - "ARM_CUSTOM_BYPASS"
   *
   * Required.
   */
  command_topic: string;

  /**
   * The name of the alarm.
   * Default: "HA Alarm"
   */
  name?: string;

  /**
   * If defined, specifies a code to enable or disable the alarm in the frontend.
   * This code is not required for MQTT interactions.
   * Only one of `code` and `code_template` can be specified.
   */
  code?: string;

  /**
   * If defined, returns a code to enable or disable the alarm in the frontend; an empty string disables checking the code.
   * Inside the template, the variables `from_state` and `to_state` identify the current and desired state.
   * Only one of `code` and `code_template` can be specified.
   */
  code_template?: string;

  /**
   * If true, the code is required to arm the alarm. If false, the code is not validated.
   * Default: true
   */
  code_arm_required?: boolean;

  /**
   * The time in seconds of delay added to the triggered state's `pending_time` before triggering the alarm.
   * Default: 0
   */
  delay_time?: number;

  /**
   * The time in seconds of the pending time before effecting a state change.
   * Default: 60
   */
  pending_time?: number;

  /**
   * The time in seconds of the trigger time in which the alarm is firing.
   * Default: 120
   */
  trigger_time?: number;

  /**
   * If true, the alarm will automatically disarm after it has been triggered instead of returning to the previous state.
   * Default: false
   */
  disarm_after_trigger?: boolean;

  /**
   * The payload to disarm this Alarm Panel.
   * Default: "DISARM"
   */
  payload_disarm?: string;

  /**
   * The payload to set armed-home mode on this Alarm Panel.
   * Default: "ARM_HOME"
   */
  payload_arm_home?: string;

  /**
   * The payload to set armed-away mode on this Alarm Panel.
   * Default: "ARM_AWAY"
   */
  payload_arm_away?: string;

  /**
   * The payload to set armed-night mode on this Alarm Panel.
   * Default: "ARM_NIGHT"
   */
  payload_arm_night?: string;

  /**
   * The payload to set armed-vacation mode on this Alarm Panel.
   * Default: "ARM_VACATION"
   */
  payload_arm_vacation?: string;

  /**
   * The payload to set armed-custom bypass mode on this Alarm Panel.
   * Default: "ARM_CUSTOM_BYPASS"
   */
  payload_arm_custom_bypass?: string;

  /**
   * State specific settings for each of the following states:
   * - armed_home
   * - armed_away
   * - armed_night
   * - armed_vacation
   * - armed_custom_bypass
   * - disarmed
   * - triggered
   *
   * Each state key can have the following optional fields:
   * - delay_time: State specific setting for delay_time (all states except triggered).
   * - pending_time: State specific setting for pending_time (all states except disarmed).
   * - trigger_time: State specific setting for trigger_time (all states except triggered).
   */
  armed_home?: StateConfig;
  armed_away?: StateConfig;
  armed_night?: StateConfig;
  armed_vacation?: StateConfig;
  armed_custom_bypass?: StateConfig;
  disarmed?: StateConfig;
  triggered?: StateConfig;
}

/**
 * Interface for state-specific settings in Manual MQTT Alarm Control Panel.
 */
export interface StateConfig {
  /**
   * State specific setting for delay_time (all states except triggered).
   */
  delay_time?: number;

  /**
   * State specific setting for pending_time (all states except disarmed).
   */
  pending_time?: number;

  /**
   * State specific setting for trigger_time (all states except triggered).
   */
  trigger_time?: number;
}
