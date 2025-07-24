/**
 * Represents a MQTT Lawn Mower component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` lawn_mower platform allows controlling a lawn mower over MQTT.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/lawn_mower.mqtt/
 */
export interface LawnMowerComponent {
  /**
   * Must be `lawn_mower`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'lawn_mower';

  /**
   * An ID that uniquely identifies this lawn mower.
   * If two lawn mowers have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic subscribed to receive an update of the activity.
   * Valid activities are `mowing`, `paused`, `docked`, and `error`.
   * Use `activity_value_template` to extract the activity state from a custom payload.
   * When payload `none` is received, the activity state will be reset to `unknown`.
   */
  activity_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the value.
   */
  activity_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `dock_command_topic`.
   * The `value` parameter in the template will be set to `dock`.
   */
  dock_command_template?: string;

  /**
   * The MQTT topic that publishes commands when the `lawn_mower.dock` action is performed.
   * The value `dock` is published when the action is used.
   * Use a `dock_command_template` to publish a custom format.
   */
  dock_command_topic?: string;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of the incoming payload.
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
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as entity attributes.
   * Implies `force_update` of the current activity state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * The name of the lawn mower.
   * Can be set to `null` if only the device name is relevant.
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * Flag that defines if the lawn mower works in optimistic mode.
   * Default: `true` if no `activity_state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `pause_command_topic`.
   * The `value` parameter in the template will be set to `pause`.
   */
  pause_command_template?: string;

  /**
   * The MQTT topic that publishes commands when the `lawn_mower.pause` action is performed.
   * The value `pause` is published when the action is used.
   * Use a `pause_command_template` to publish a custom format.
   */
  pause_command_topic?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `start_mowing_command_topic`.
   * The `value` parameter in the template will be set to `start_mowing`.
   */
  start_mowing_template?: string;

  /**
   * The MQTT topic that publishes commands when the `lawn_mower.start_mowing` action is performed.
   * The value `start_mowing` is published when the action is used.
   * Use a `start_mowing_command_template` to publish a custom format.
   */
  start_mowing_command_topic?: string;

  /**
   * If the published message should have the retain flag on or not.
   * Default: false
   */
  retain?: boolean;
}
