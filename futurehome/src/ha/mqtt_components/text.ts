/**
 * Represents a MQTT Text component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` Text platform allows you to integrate devices that show text that can be set remotely.
 * Optionally the text state can be monitored too using MQTT.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/text.mqtt/
 */
export interface TextComponent {
  /**
   * Must be `text`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'text';

  /**
   * An ID that uniquely identifies this text entity.
   * If two text entities have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic to publish the text value that is set.
   */
  command_topic: string;

  /**
   * The MQTT topic subscribed to receive text state updates.
   * Text state updates should match the `pattern` (if set) and meet the size constraints `min` and `max`.
   * Can be used with `value_template` to render the incoming payload to a text update.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the text state value from the payload received on `state_topic`.
   */
  value_template?: string;

  /**
   * The name of the text entity.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Text"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * The maximum size of a text being set or received (maximum is 255).
   * Default: 255
   */
  max?: number;

  /**
   * The minimum size of a text being set or received.
   * Default: 0
   */
  min?: number;

  /**
   * The mode off the text entity.
   * Must be either `text` or `password`.
   * Default: text
   */
  mode?: 'text' | 'password';

  /**
   * A valid regular expression the text being set or received must match with.
   */
  pattern?: string;

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The [category](https://developers.home-assistant.io/docs/core/entity#generic-properties) of the entity.
   */
  entity_category?: string;

  /**
   * Picture URL for the entity.
   */
  entity_picture?: string;

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
   * The string that represents the `online` state.
   * Default: "online"
   */
  payload_available?: string;

  /**
   * The string that represents the `offline` state.
   * Default: "offline"
   */
  payload_not_available?: string;

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
}
