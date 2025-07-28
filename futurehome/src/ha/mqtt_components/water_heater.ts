import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Water Heater component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` water heater platform lets you control your MQTT enabled water heater devices.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/water_heater.mqtt/
 */
export interface WaterHeaterComponent extends BaseComponent {
  /**
   * Must be `water_heater`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'water_heater';

  /**
   * The MQTT topic to publish commands to change the water heater operation mode.
   */
  mode_command_topic?: string;

  /**
   * A template to render the value sent to the `mode_command_topic` with.
   */
  mode_command_template?: string;

  /**
   * The MQTT topic to subscribe for changes of the water heater operation mode.
   * If this is not set, the operation mode works in optimistic mode (see below).
   * A "None" payload resets to an `unknown` state. An empty payload is ignored.
   */
  mode_state_topic?: string;

  /**
   * A template to render the value received on the `mode_state_topic` with.
   */
  mode_state_template?: string;

  /**
   * A list of supported modes.
   * Needs to be a subset of the default values.
   * Default: ['off', 'eco', 'electric', 'gas', 'heat_pump', 'high_demand', 'performance']
   */
  modes?: string[];

  /**
   * The MQTT topic to publish commands to change the water heater power state.
   * Sends the payload configured with `payload_on` if the water heater is turned on via the `water_heater.turn_on`,
   * or the payload configured with `payload_off` if the water heater is turned off via the `water_heater.turn_off` action.
   * Note that `optimistic` mode is not supported through `water_heater.turn_on` and `water_heater.turn_off` actions.
   * When called, these actions will send a power command to the device but will not optimistically update the state of the water heater.
   * The water heater device should report its state back via `mode_state_topic`.
   */
  power_command_topic?: string;

  /**
   * A template to render the value sent to the `power_command_topic` with.
   * The `value` parameter is the payload set for `payload_on` or `payload_off`.
   */
  power_command_template?: string;

  /**
   * The payload that represents enabled state.
   * Default: "ON"
   */
  payload_on?: string;

  /**
   * The payload that represents disabled state.
   * Default: "OFF"
   */
  payload_off?: string;

  /**
   * Flag that defines if the water heater works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Default: "`true` if no state topic defined, else `false`."
   */
  optimistic?: boolean;

  /**
   * The MQTT topic to publish commands to change the target temperature.
   */
  temperature_command_topic?: string;

  /**
   * A template to render the value sent to the `temperature_command_topic` with.
   */
  temperature_command_template?: string;

  /**
   * The MQTT topic to subscribe for changes in the target temperature.
   * If this is not set, the target temperature works in optimistic mode (see below).
   * A `"None"` value received will reset the temperature set point.
   * Empty values (`'''`) will be ignored.
   */
  temperature_state_topic?: string;

  /**
   * A template to render the value received on the `temperature_state_topic` with.
   */
  temperature_state_template?: string;

  /**
   * Defines the temperature unit of the device, `C` or `F`.
   * If this is not set, the temperature unit is set to the system temperature unit.
   */
  temperature_unit?: string;

  /**
   * The desired precision for this device.
   * Can be used to match your actual water heater's precision.
   * Supported values are `0.1`, `0.5` and `1.0`.
   * Default: 0.1 for Celsius and 1.0 for Fahrenheit.
   */
  precision?: number;

  /**
   * Set the initial target temperature.
   * The default value depends on the temperature unit, and will be 43.3°C or 110°F.
   */
  initial?: number;

  /**
   * Maximum set point available.
   * The default value depends on the temperature unit, and will be 60°C or 140°F.
   */
  max_temp?: number;

  /**
   * Minimum set point available.
   * The default value depends on the temperature unit, and will be 43.3°C or 110°F.
   */
  min_temp?: number;

  /**
   * A template with which the value received on `current_temperature_topic` will be rendered.
   */
  current_temperature_template?: string;

  /**
   * The MQTT topic on which to listen for the current temperature.
   * A `"None"` value received will reset the current temperature.
   * Empty values (`'''`) will be ignored.
   */
  current_temperature_topic?: string;

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
   * Default template to render the payloads on *all* `*_state_topic`s with.
   */
  value_template?: string;
}
