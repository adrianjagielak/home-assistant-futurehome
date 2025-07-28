import { BaseComponent } from './_base_component';

/**
 * Represents an MQTT Alarm Control Panel component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` alarm control panel integration enables control of MQTT capable alarm panels.
 * The Alarm icon will change state after receiving updates from `state_topic`. If using the MQTT RETAIN flag,
 * the panel receives an initial state instantly. Otherwise, the initial state is `unknown`.
 *
 * Valid states accepted from the Alarm Panel (case insensitive):
 * `disarmed`, `armed_home`, `armed_away`, `armed_night`, `armed_vacation`,
 * `armed_custom_bypass`, `pending`, `triggered`, `arming`, `disarming`
 *
 * For full documentation see:
 * https://www.home-assistant.io/integrations/alarm_control_panel.mqtt/
 */
export interface AlarmControlPanelComponent extends BaseComponent {
  /**
   * Must be `alarm_control_panel`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'alarm_control_panel';

  /**
   * The MQTT topic subscribed to receive state updates.
   * A `None` payload resets to an `unknown` state.
   * An empty payload is ignored.
   * Valid state payloads are:
   * `armed_away`, `armed_custom_bypass`, `armed_home`, `armed_night`,
   * `armed_vacation`, `arming`, `disarmed`, `disarming`, `pending` and `triggered`.
   */
  state_topic: string;

  /**
   * The MQTT topic to publish commands to change the alarm state.
   */
  command_topic: string;

  /**
   * If defined, specifies a code to enable or disable the alarm in the frontend.
   * Note that the code is validated locally and blocks sending MQTT messages to the remote device.
   * For remote code validation use special values `REMOTE_CODE` (numeric code) or `REMOTE_CODE_TEXT` (text code).
   * In that case local validation is bypassed, but frontend will display a corresponding code dialog.
   * Use `command_template` to send the code to the remote device.
   */
  code?: string;

  /**
   * If true the code is required to arm the alarm. If false the code is not validated.
   * Default: true
   */
  code_arm_required?: boolean;

  /**
   * If true the code is required to disarm the alarm. If false the code is not validated.
   * Default: true
   */
  code_disarm_required?: boolean;

  /**
   * If true the code is required to trigger the alarm. If false the code is not validated.
   * Default: true
   */
  code_trigger_required?: boolean;

  /**
   * The [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * used for the command payload.
   * Available variables: `action` and `code`.
   * Default: "action"
   */
  command_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-template-configuration) documentation.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-topic-configuration) documentation.
   */
  json_attributes_topic?: string;

  /**
   * The payload to set armed-away mode on your Alarm Panel.
   * Default: "ARM_AWAY"
   */
  payload_arm_away?: string;

  /**
   * The payload to set armed-home mode on your Alarm Panel.
   * Default: "ARM_HOME"
   */
  payload_arm_home?: string;

  /**
   * The payload to set armed-night mode on your Alarm Panel.
   * Default: "ARM_NIGHT"
   */
  payload_arm_night?: string;

  /**
   * The payload to set armed-vacation mode on your Alarm Panel.
   * Default: "ARM_VACATION"
   */
  payload_arm_vacation?: string;

  /**
   * The payload to set armed-custom-bypass mode on your Alarm Panel.
   * Default: "ARM_CUSTOM_BYPASS"
   */
  payload_arm_custom_bypass?: string;

  /**
   * The payload to disarm your Alarm Panel.
   * Default: "DISARM"
   */
  payload_disarm?: string;

  /**
   * The payload to trigger the alarm on your Alarm Panel.
   * Default: "TRIGGER"
   */
  payload_trigger?: string;

  /**
   * A list of features that the alarm control panel supports.
   * The available list options are `arm_home`, `arm_away`, `arm_night`, `arm_vacation`, `arm_custom_bypass`, and `trigger`.
   * Default: ["arm_home", "arm_away", "arm_night", "arm_vacation", "arm_custom_bypass", "trigger"]
   */
  supported_features?: Array<
    | 'arm_home'
    | 'arm_away'
    | 'arm_night'
    | 'arm_vacation'
    | 'arm_custom_bypass'
    | 'trigger'
  >;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the value.
   */
  value_template?: string;
}
