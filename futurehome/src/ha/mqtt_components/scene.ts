import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Scene component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` scene platform lets you control your MQTT enabled scenes.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/scene.mqtt/
 */
export interface SceneComponent extends BaseComponent {
  /**
   * Must be `scene`. Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'scene';

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
}
