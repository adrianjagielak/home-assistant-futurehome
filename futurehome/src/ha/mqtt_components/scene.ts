/**
 * Represents a MQTT Scene component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` scene platform lets you control your MQTT enabled scenes.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/scene.mqtt/
 */
export interface SceneComponent {
  /**
   * Must be `scene`. Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'scene';

  /**
   * An ID that uniquely identifies this scene entity.
   * If two scenes have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic to publish `payload_on` to activate the scene.
   */
  command_topic?: string;

  /**
   * The payload that will be sent to `command_topic` when activating the MQTT scene.
   * Default: "ON"
   */
  payload_on?: string;

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
   * The encoding of the published messages.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * Icon for the scene.
   */
  icon?: string;

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
   * The name to use when displaying this scene.
   * Default: "MQTT Scene"
   */
  name?: string;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

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
