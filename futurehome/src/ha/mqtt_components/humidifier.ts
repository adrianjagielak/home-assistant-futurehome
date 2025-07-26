import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Humidifier component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` humidifier platform lets you control your MQTT enabled humidifiers.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/humidifier.mqtt/
 */
export interface HumidifierComponent extends BaseComponent {
  /**
   * Must be `humidifier`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'humidifier';

  /**
   * The MQTT topic to publish commands to change the humidifier state.
   */
  command_topic: string;

  /**
   * The MQTT topic to publish commands to change the humidifier target humidity state based on a percentage.
   */
  target_humidity_command_topic: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * A `"None"` payload resets to an `unknown` state.
   * An empty payload is ignored.
   * Valid state payloads are `OFF` and `ON`.
   * Custom `OFF` and `ON` values can be set with the `payload_off` and `payload_on` config options.
   */
  state_topic?: string;

  /**
   * The MQTT topic on which to listen for the current humidity.
   * A `"None"` value received will reset the current humidity.
   * Empty values (`''`) will be ignored.
   */
  current_humidity_topic?: string;

  /**
   * The MQTT topic subscribed to receive humidifier target humidity.
   */
  target_humidity_state_topic?: string;

  /**
   * The MQTT topic subscribed to receive the humidifier `mode`.
   */
  mode_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the `mode` on the humidifier.
   * This attribute must be configured together with the `modes` attribute.
   */
  mode_command_topic?: string;

  /**
   * The MQTT topic to subscribe for changes of the current action.
   * Valid values: `off`, `humidifying`, `drying`, `idle`
   */
  action_topic?: string;

  /**
   * Flag that defines if humidifier works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Defaults to `true` if no state topic defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * A list of available modes this humidifier is capable of running at.
   * Common examples include `normal`, `eco`, `away`, `boost`, `comfort`, `home`, `sleep`, `auto` and `baby`.
   * These examples offer built-in translations but other custom modes are allowed as well.
   * This attribute must be configured together with the `mode_command_topic` attribute.
   */
  modes?: string[];

  /**
   * The [device class](https://www.home-assistant.io/integrations/humidifier/#device-class) of the MQTT device.
   * Must be either `humidifier`, `dehumidifier` or `null`.
   * Default: `humidifier`
   */
  device_class?: 'humidifier' | 'dehumidifier' | null;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that returns a string to be compared to the payload.
   * Used to extract a value for the humidifier `target_humidity` state.
   */
  target_humidity_state_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that returns a string to be compared to the payload.
   * Used to extract a value for the humidifier `mode` state.
   */
  mode_state_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * with which the value received on `current_humidity_topic` will be rendered.
   */
  current_humidity_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `target_humidity_command_topic`.
   */
  target_humidity_command_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `mode_command_topic`.
   */
  mode_command_template?: string;

  /**
   * A special payload that resets the `target_humidity` state attribute to an `unknown` state
   * when received at the `target_humidity_state_topic`.
   * When received at `current_humidity_topic`, it will reset the current humidity state.
   * Default: `"None"`
   */
  payload_reset_humidity?: string;

  /**
   * A special payload that resets the `mode` state attribute to an `unknown` state
   * when received at the `mode_state_topic`.
   * Default: `"None"`
   */
  payload_reset_mode?: string;

  /**
   * The payload that represents the running state.
   * Default: `"ON"`
   */
  payload_on?: string;

  /**
   * The payload that represents the stop state.
   * Default: `"OFF"`
   */
  payload_off?: string;

  /**
   * The maximum target humidity percentage that can be set.
   * Default: 100
   */
  max_humidity?: number;

  /**
   * The minimum target humidity percentage that can be set.
   * Default: 0
   */
  min_humidity?: number;

  /**
   * The string that represents the `online` state.
   * Default: `"online"`
   */
  payload_available?: string;

  /**
   * The string that represents the `offline` state.
   * Default: `"offline"`
   */
  payload_not_available?: string;

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
}
