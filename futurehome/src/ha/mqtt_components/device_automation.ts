/**
 * Represents a MQTT Device Trigger component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` device trigger platform uses an MQTT message payload to generate device trigger events.
 *
 * An MQTT device trigger is a better option than a [binary sensor](https://www.home-assistant.io/integrations/binary_sensor.mqtt/)
 * for buttons, remote controls, etc.
 *
 * MQTT device triggers are only supported through [MQTT discovery](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery),
 * manual setup through `configuration.yaml` is not supported.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/device_automation.mqtt/
 */
export interface DeviceAutomationComponent {
  /**
   * Must be `device_automation`. Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'device_automation';

  /**
   * An ID that uniquely identifies this device trigger.
   * If two device triggers have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id: string;

  /**
   * The type of automation, must be 'trigger'.
   */
  automation_type: 'trigger';

  /**
   * Optional payload to match the payload being sent over the topic.
   */
  payload?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

  /**
   * The MQTT topic subscribed to receive trigger events.
   */
  topic: string;

  /**
   * The type of the trigger, e.g. `button_short_press`.
   * Entries supported by the frontend:
   * `button_short_press`, `button_short_release`, `button_long_press`, `button_long_release`,
   * `button_double_press`, `button_triple_press`, `button_quadruple_press`, `button_quintuple_press`.
   * If set to an unsupported value, will render as `subtype type`,
   * e.g. `button_1 spammed` with `type` set to `spammed` and `subtype` set to `button_1`.
   */
  type: string;

  /**
   * The subtype of the trigger, e.g. `button_1`.
   * Entries supported by the frontend:
   * `turn_on`, `turn_off`, `button_1`, `button_2`, `button_3`, `button_4`, `button_5`, `button_6`.
   * If set to an unsupported value, will render as `subtype type`,
   * e.g. `left_button pressed` with `type` set to `button_short_press` and `subtype` set to `left_button`.
   */
  subtype: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the value.
   */
  value_template?: string;
}
