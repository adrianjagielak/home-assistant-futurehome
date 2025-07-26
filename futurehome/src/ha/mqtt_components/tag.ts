import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Tag Scanner component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` tag scanner platform uses an MQTT message payload to generate tag scanned events.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/tag.mqtt/
 */
export interface TagComponent extends BaseComponent {
  /**
   * Must be `tag`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'tag';

  /**
   * The MQTT topic subscribed to receive tag scanned events.
   */
  topic: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) that returns a tag ID.
   */
  value_template?: string;
}
