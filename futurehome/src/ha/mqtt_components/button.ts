import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Button component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` button platform lets you send an MQTT message when the button is pressed in the frontend
 * or the button press action is called. This can be used to expose some service of a remote device, for example reboot.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/button.mqtt/
 */
export interface ButtonComponent extends BaseComponent {
  /**
   * Must be `button`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'button';

  /**
   * The MQTT topic to publish commands to trigger the button.
   */
  command_topic: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * The payload To send to trigger the button.
   * Default: "PRESS"
   */
  payload_press?: string;

  /**
   * The [type/class](https://www.home-assistant.io/integrations/button/#device-class) of the button to set the icon in the frontend.
   * The `device_class` defaults to `null` (generic button).
   */
  device_class?: 'identify' | 'restart' | 'update' | null;

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
