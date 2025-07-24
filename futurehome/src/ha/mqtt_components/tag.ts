/**
 * Represents a MQTT Tag Scanner component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` tag scanner platform uses an MQTT message payload to generate tag scanned events.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/tag.mqtt/
 */
export interface TagComponent {
  /**
   * Must be `tag`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'tag';

  /**
   * An ID that uniquely identifies this tag.
   * If two tags have the same unique ID, Home Assistant will raise an exception.
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
   * The MQTT topic subscribed to receive tag scanned events.
   */
  topic: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) that returns a tag ID.
   */
  value_template?: string;
}
