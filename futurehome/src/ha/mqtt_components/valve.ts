import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Valve component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` valve platform allows control of an MQTT valve such as gas or water valves.
 * Valve states can be `open`, `opening`, `closed`, or `closing`.
 * The valve can also report and set position if `reports_position` is enabled.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/valve.mqtt/
 */
export interface ValveComponent extends BaseComponent {
  /**
   * Must be `valve`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'valve';

  /**
   * The MQTT topic to publish commands to control the valve.
   * The value sent can be a value defined by `payload_open`, `payload_close`, or `payload_stop`.
   * If `reports_position` is set to `true`, a numeric value will be published instead.
   */
  command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * The MQTT topic subscribed to receive valve state messages.
   * State topic accepts a state payload (`open`, `opening`, `closed`, or `closing`) or, if `reports_position` is supported,
   * a numeric value representing the position.
   * In JSON format, both `state` and `position` can be reported together.
   * A `null` state value resets to an `unknown` state.
   * An empty string is ignored.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that can be used to extract the payload for the `state_topic` topic.
   * The rendered value should be a defined state payload or, if reporting a `position` and `reports_position` is `true`,
   * a numeric value expected representing the position. See also `state_topic`.
   */
  value_template?: string;

  /**
   * Flag that defines if the valve works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Optimistic mode means the valve immediately changes state after command is sent,
   * without waiting for state update from the device.
   * Defaults to `false` if `state_topic` or position topics are defined; `true` otherwise.
   */
  optimistic?: boolean;

  /**
   * Set to `true` if the valve reports the position or supports setting the position.
   * Enabling this causes position to be published instead of payloads defined by `payload_open`, `payload_close`, or `payload_stop`.
   * When receiving messages, `state_topic` accepts numeric payloads or one of the states: `open`, `opening`, `closed`, or `closing`.
   */
  reports_position?: boolean;

  /**
   * Number which represents the closed position.
   * The valve's position will be scaled to the (`position_closed`...`position_open`) range when an action is performed and scaled back when a value is received.
   * Default: 0
   */
  position_closed?: number;

  /**
   * Number which represents the open position.
   * The valve's position will be scaled to the (`position_closed`...`position_open`) range when an action is performed and scaled back when a value is received.
   * Default: 100
   */
  position_open?: number;

  /**
   * The command payload that opens the valve.
   * Only used when `reports_position` is `false` (default).
   * Not allowed if `reports_position` is `true`.
   * Can be set to `null` to disable the valve's open option.
   * Default: "OPEN"
   */
  payload_open?: string | null;

  /**
   * The command payload that closes the valve.
   * Only used when `reports_position` is `false` (default).
   * Not allowed if `reports_position` is `true`.
   * Can be set to `null` to disable the valve's close option.
   * Default: "CLOSE"
   */
  payload_close?: string | null;

  /**
   * The command payload that stops the valve.
   * If not configured, the valve will not support the `valve.stop` action.
   */
  payload_stop?: string;

  /**
   * The payload that represents the open state.
   * Only allowed when `reports_position` is `false` (default).
   * Default: "open"
   */
  state_open?: string;

  /**
   * The payload that represents the opening state.
   * Default: "opening"
   */
  state_opening?: string;

  /**
   * The payload that represents the closed state.
   * Only allowed when `reports_position` is `false` (default).
   * Default: "closed"
   */
  state_closed?: string;

  /**
   * The payload that represents the closing state.
   * Default: "closing"
   */
  state_closing?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as valve attributes.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-topic-configuration) documentation.
   */
  json_attributes_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-template-configuration) documentation.
   */
  json_attributes_template?: string;

  /**
   * The payload that represents the online state.
   * Default: "online"
   */
  payload_available?: string;

  /**
   * The payload that represents the offline state.
   * Default: "offline"
   */
  payload_not_available?: string;

  /**
   * Sets the [class of the device](https://www.home-assistant.io/integrations/valve/#device_class),
   * changing the device state and icon that is displayed on the frontend.
   * The `device_class` defaults to `null`.
   */
  device_class?: string | null;
}
