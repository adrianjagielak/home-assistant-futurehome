import { BaseComponent } from './_base_component';

/**
 * Represents an MQTT Notify component for Home Assistant MQTT Discovery.
 *
 * The MQTT notify platform lets you send an MQTT message when the `send_message` action is called.
 * This can be used to expose an action of a remote device that allows processing a message,
 * such as showing it on a screen.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/notify.mqtt/
 */
export interface NotifyComponent extends BaseComponent {
  /**
   * Must be `notify`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'notify';

  /**
   * The MQTT topic to publish send message commands at.
   */
  command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

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
