import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Lawn Mower component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` lawn_mower platform allows controlling a lawn mower over MQTT.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/lawn_mower.mqtt/
 */
export interface LawnMowerComponent extends BaseComponent {
  /**
   * Must be `lawn_mower`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'lawn_mower';

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
   * Flag that defines if the lawn mower works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
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
}
