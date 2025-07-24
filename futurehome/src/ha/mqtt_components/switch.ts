/**
 * Represents a MQTT Switch component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` switch platform lets you control your MQTT enabled switches.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/switch.mqtt/
 */
export interface SwitchComponent {
  /**
   * Must be `switch`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'switch';

  /**
   * An ID that uniquely identifies this switch.
   * If two switches have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic to publish commands to change the switch state.
   */
  command_topic: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * A "None" payload resets to an `unknown` state. An empty payload is ignored.
   * By default, valid state payloads are `OFF` and `ON`.
   * The accepted payloads can be overridden with the `payload_off` and `payload_on` config options.
   */
  state_topic?: string;

  /**
   * The [type/class](https://www.home-assistant.io/integrations/switch/#device-class) of the switch to set the icon in the frontend. The `device_class` can be `null`.
   */
  device_class?: string | null;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * The [category](https://developers.home-assistant.io/docs/core/entity#generic-properties) of the entity.
   */
  entity_category?: string;

  /**
   * Picture URL for the entity.
   */
  entity_picture?: string;

  /**
   * [Icon](https://www.home-assistant.io/docs/configuration/customizing-devices/#icon) for the entity.
   */
  icon?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-template-configuration) documentation.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-topic-configuration) documentation.
   */
  json_attributes_topic?: string;

  /**
   * The name to use when displaying this switch.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Switch"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * Flag that defines if switch works in optimistic mode.
   * Default: `true` if no `state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * The payload that represents the available state.
   * Default: "online"
   */
  payload_available?: string;

  /**
   * The payload that represents the unavailable state.
   * Default: "offline"
   */
  payload_not_available?: string;

  /**
   * The payload that represents `off` state.
   * If specified, will be used for both comparing to the value in the `state_topic` (see `value_template` and `state_off` for details)
   * and sending as `off` command to the `command_topic`.
   * Default: "OFF"
   */
  payload_off?: string;

  /**
   * The payload that represents `on` state.
   * If specified, will be used for both comparing to the value in the `state_topic` (see `value_template` and `state_on` for details)
   * and sending as `on` command to the `command_topic`.
   * Default: "ON"
   */
  payload_on?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

  /**
   * If the published message should have the retain flag on or not.
   * Default: false
   */
  retain?: boolean;

  /**
   * The payload that represents the `off` state.
   * Used when value that represents `off` state in the `state_topic` is different from value that should be sent to the `command_topic` to turn the device `off`.
   * Default: `payload_off` if defined, else `OFF`
   */
  state_off?: string;

  /**
   * The payload that represents the `on` state.
   * Used when value that represents `on` state in the `state_topic` is different from value that should be sent to the `command_topic` to turn the device `on`.
   * Default: `payload_on` if defined, else `ON`
   */
  state_on?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt) to generate the payload to send to `command_topic`.
   * The switch command template accepts the parameter `value`.
   * The `value` parameter will contain the configured value for either `payload_on` or `payload_off`.
   */
  command_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract device's state from the `state_topic`.
   * To determine the switch's state, the result of this template will be compared to `state_on` and `state_off`.
   */
  value_template?: string;
}
