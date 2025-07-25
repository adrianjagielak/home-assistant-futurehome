/**
 * Represents a MQTT Button component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` button platform lets you send an MQTT message when the button is pressed in the frontend
 * or the button press action is called. This can be used to expose some service of a remote device, for example reboot.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/button.mqtt/
 */
export interface ButtonComponent {
  /**
   * Must be `button`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'button';

  /**
   * An ID that uniquely identifies this button.
   * If two buttons have the same unique ID, Home Assistant will raise an exception.
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
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The encoding of the published messages.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * [Icon](https://www.home-assistant.io/docs/configuration/customizing-devices/#icon) for the entity.
   *
   * The icon must be a Material Design Icons (MDI) string identifier, for example: `mdi:thermometer`, `mdi:battery`, or `mdi:water`.
   *
   * It is recommended to set the icon when the default icon or other entity identifiers (such as `device_class` or `state_class`)
   * do not accurately represent the purpose of the entity. In most cases, relying on the automatic icon selection ensures better consistency
   * and compatibility with future updates.
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
   * The name to use when displaying this button.
   *
   * It is recommended to set the name when entity identifiers (such as `device_class` or `state_class`)
   * do not accurately represent the purpose of the entity, to avoid showing the default 'MQTT' name.
   *
   * Default: "MQTT Button"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`
   */
  object_id?: string;

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
