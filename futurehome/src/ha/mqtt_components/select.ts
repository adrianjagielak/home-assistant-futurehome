/**
 * Represents a MQTT Select component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` Select platform allows you to integrate devices that might expose configuration
 * options through MQTT into Home Assistant as a Select. Every time a message under the
 * `state_topic` is received, the select entity will be updated in Home Assistant and vice-versa,
 * keeping the device and Home Assistant in sync.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/select.mqtt/
 */
export interface SelectComponent {
  /**
   * Must be `select`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'select';

  /**
   * An ID that uniquely identifies this select.
   * If two selects have the same unique ID Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id: string;

  /**
   * The [category](https://developers.home-assistant.io/docs/core/entity#generic-properties) of the entity.
   */
  entity_category?: string;

  /**
   * Picture URL for the entity.
   */
  entity_picture?: string;

  /**
   * The MQTT topic subscribed to receive update of the selected option.
   * A "None" payload resets to an `unknown` state. An empty payload is ignored.
   */
  state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the selected option.
   */
  command_topic: string;

  /**
   * List of options that can be selected. An empty list or a list with a single item is allowed.
   */
  options: string[];

  /**
   * Flag that defines if the select works in optimistic mode.
   * Default: `true` if no `state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the value.
   */
  value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

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
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * [Icon](https://www.home-assistant.io/docs/configuration/customizing-devices/#icon) for the entity.
   */
  icon?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as entity attributes.
   * Implies `force_update` of the current select state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * The name of the Select. Can be set to `null` if only the device name is relevant.
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;
}
