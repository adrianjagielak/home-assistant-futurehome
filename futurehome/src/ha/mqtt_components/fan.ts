import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Fan component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` fan platform lets you control your MQTT enabled fans.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/fan.mqtt/
 */
export interface FanComponent extends BaseComponent {
  /**
   * Must be `fan`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'fan';

  /**
   * The MQTT topic to publish commands to change the fan state.
   */
  command_topic: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * A "None" payload resets to an `unknown` state.
   * An empty payload is ignored.
   * By default, valid state payloads are `OFF` and `ON`.
   * The accepted payloads can be overridden with the `payload_off` and `payload_on` config options.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract a value from the state.
   */
  state_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * The MQTT topic subscribed to receive direction state updates.
   */
  direction_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the direction state.
   */
  direction_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract a value from the direction.
   */
  direction_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `direction_command_topic`.
   */
  direction_command_template?: string;

  /**
   * The MQTT topic subscribed to receive oscillation state updates.
   */
  oscillation_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the oscillation state.
   */
  oscillation_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract a value from the oscillation.
   */
  oscillation_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `oscillation_command_topic`.
   */
  oscillation_command_template?: string;

  /**
   * The MQTT topic subscribed to receive fan speed based on percentage.
   */
  percentage_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the fan speed state based on a percentage.
   */
  percentage_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the `percentage` value from the payload received on `percentage_state_topic`.
   */
  percentage_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `percentage_command_topic`.
   */
  percentage_command_template?: string;

  /**
   * The MQTT topic subscribed to receive fan speed based on presets.
   */
  preset_mode_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the preset mode.
   */
  preset_mode_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the `preset_mode` value from the payload received on `preset_mode_state_topic`.
   */
  preset_mode_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `preset_mode_command_topic`.
   */
  preset_mode_command_template?: string;

  /**
   * List of preset modes this fan is capable of running at.
   * Common examples include `auto`, `smart`, `whoosh`, `eco` and `breeze`.
   */
  preset_modes?: string[];

  /**
   * Flag that defines if fan works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Default: `true` if no state topic defined, else `false`.
   */
  optimistic?: boolean;

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
   * The payload that represents the stop state.
   * Default: "OFF"
   */
  payload_off?: string;

  /**
   * The payload that represents the running state.
   * Default: "ON"
   */
  payload_on?: string;

  /**
   * The payload that represents the oscillation off state.
   * Default: "oscillate_off"
   */
  payload_oscillation_off?: string;

  /**
   * The payload that represents the oscillation on state.
   * Default: "oscillate_on"
   */
  payload_oscillation_on?: string;

  /**
   * A special payload that resets the `percentage` state attribute to `unknown` when received at the `percentage_state_topic`.
   * Default: "None"
   */
  payload_reset_percentage?: string;

  /**
   * A special payload that resets the `preset_mode` state attribute to `unknown` when received at the `preset_mode_state_topic`.
   * Default: "None"
   */
  payload_reset_preset_mode?: string;

  /**
   * The maximum of numeric output range (representing 100 %).
   * The `percentage_step` is defined by `100` / the number of speeds within the speed range.
   * Default: 100
   */
  speed_range_max?: number;

  /**
   * The minimum of numeric output range (`off` not included, so `speed_range_min` - `1` represents 0 %).
   * The `percentage_step` is defined by `100` / the number of speeds within the speed range.
   * Default: 1
   */
  speed_range_min?: number;
}
