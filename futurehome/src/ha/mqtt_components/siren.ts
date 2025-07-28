import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Siren component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` siren platform lets you control your MQTT enabled sirens and text based notification devices.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/siren.mqtt/
 */
export interface SirenComponent extends BaseComponent {
  /**
   * Must be `siren`. Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'siren';

  /**
   * List of available tones the siren supports. When configured, this enables the support for setting a `tone` and enables the `tone` state attribute.
   */
  available_tones?: string[];

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt) to generate a custom payload to send to `command_topic`. The variable `value` will be assigned with the configured `payload_on` or `payload_off` setting. The siren turn on action parameters `tone`, `volume_level` or `duration` can be used as variables in the template. When operating in optimistic mode the corresponding state attributes will be set. Turn on parameters will be filtered if a device misses the support.
   */
  command_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt) to generate a custom payload to send to `command_topic` when the siren turn off action is called. By default `command_template` will be used as template for action turn off. The variable `value` will be assigned with the configured `payload_off` setting.
   */
  command_off_template?: string;

  /**
   * The MQTT topic to publish commands to change the siren state. Without command templates, a default JSON payload like `{"state":"ON", "tone": "bell", "duration": 10, "volume_level": 0.5 }` is published. When the siren turn on action is performed, the startup parameters will be added to the JSON payload. The `state` value of the JSON payload will be set to the the `payload_on` or `payload_off` configured payload.
   */
  command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the JSON dictionary from messages received on the `json_attributes_topic`. Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-template-configuration) documentation.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes. Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-topic-configuration) documentation.
   */
  json_attributes_topic?: string;

  /**
   * Flag that defines if siren works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Default: `true` if no `state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * The payload that represents `off` state. If specified, will be used for both comparing to the value in the `state_topic` (see `value_template` and `state_off` for details) and sending as `off` command to the `command_topic`.
   * Default: "OFF"
   */
  payload_off?: string;

  /**
   * The payload that represents `on` state. If specified, will be used for both comparing to the value in the `state_topic` (see `value_template` and `state_on` for details) and sending as `on` command to the `command_topic`.
   * Default: "ON"
   */
  payload_on?: string;

  /**
   * The payload that represents the `off` state. Used when value that represents `off` state in the `state_topic` is different from value that should be sent to the `command_topic` to turn the device `off`.
   * Default: "`payload_off` if defined, else `'OFF'`"
   */
  state_off?: string;

  /**
   * The payload that represents the `on` state. Used when value that represents `on` state in the `state_topic` is different from value that should be sent to the `command_topic` to turn the device `on`.
   * Default: "`payload_on` if defined, else `'ON'`"
   */
  state_on?: string;

  /**
   * The MQTT topic subscribed to receive state updates. The state update may be either JSON or a simple string. When a JSON payload is detected, the `state` value of the JSON payload should supply the `payload_on` or `payload_off` defined payload to turn the siren on or off. Additionally, the state attributes `duration`, `tone` and `volume_level` can be updated. Use `value_template` to transform the received state update to a compliant JSON payload. Attributes will only be set if the function is supported by the device and a valid value is supplied. When a non-JSON payload is detected, it should be either of the `payload_on` or `payload_off` defined payloads or `None` to reset the siren's state to `unknown`. The initial state will be `unknown`. The state will be reset to `unknown` if a `None` payload or `null` JSON value is received as a state update.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract device's state from the `state_topic`. To determine the siren's state result of this template will be compared to `state_on` and `state_off`. Alternatively `value_template` can be used to render to a valid JSON payload.
   */
  state_value_template?: string;

  /**
   * Set to `true` if the MQTT siren supports the `duration` turn on action parameter and enables the `duration` state attribute.
   * Default: true
   */
  support_duration?: boolean;

  /**
   * Set to `true` if the MQTT siren supports the `volume_set` turn on action parameter and enables the `volume_level` state attribute.
   * Default: true
   */
  support_volume_set?: boolean;
}
