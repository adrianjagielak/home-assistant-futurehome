import { BaseComponent } from './_base_component';
import { CoverDeviceClass } from './_enums';

/**
 * Represents a MQTT Cover component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` cover platform allows you to control an MQTT cover (such as blinds, a roller shutter or a garage door).
 *
 * A cover entity can be in states (`open`, `opening`, `closed`, `closing` or `stopped`).
 * See the full documentation at https://www.home-assistant.io/integrations/cover.mqtt/
 */
export interface CoverComponent extends BaseComponent {
  /**
   * Must be `cover`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'cover';

  /**
   * The MQTT topic to publish commands to control the cover.
   */
  command_topic?: string;

  /**
   * Sets the [class of the device](https://www.home-assistant.io/integrations/cover/#device_class),
   * changing the device state and icon that is displayed on the frontend.
   * The `device_class` defaults to `null` (generic cover).
   */
  device_class?: CoverDeviceClass;

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
   * Flag that defines if switch works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Default: `false` if `state_topic` or `position_topic` defined, else `true`.
   */
  optimistic?: boolean;

  /**
   * The command payload that closes the cover.
   * Set to `null` to disable the close command.
   * Default: "CLOSE"
   */
  payload_close?: string | null;

  /**
   * The payload that represents the offline state.
   * Default: "offline"
   */
  payload_not_available?: string;

  /**
   * The command payload that opens the cover.
   * Set to `null` to disable the open command.
   * Default: "OPEN"
   */
  payload_open?: string | null;

  /**
   * The command payload that stops the cover.
   * Set to `null` to disable the stop command.
   * Default: "STOP"
   */
  payload_stop?: string | null;

  /**
   * Number which represents closed position.
   * Default: 0
   */
  position_closed?: number;

  /**
   * Number which represents open position.
   * Default: 100
   */
  position_open?: number;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that can be used to extract the payload for the `position_topic` topic.
   * Within the template the following variables are available: `entity_id`, `position_open`, `position_closed`, `tilt_min`, `tilt_max`.
   * The `entity_id` can be used to reference the entity's attributes with help of the [states](https://www.home-assistant.io/docs/configuration/templating/#states) template function.
   */
  position_template?: string;

  /**
   * The MQTT topic subscribed to receive cover position messages.
   */
  position_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to define the position to be sent to the `set_position_topic` topic.
   * Incoming position value is available for use in the template `{% raw %}{{ position }}{% endraw %}`.
   * Within the template the following variables are available: `entity_id`, `position`, the target position in percent; `position_open`; `position_closed`; `tilt_min`; `tilt_max`.
   * The `entity_id` can be used to reference the entity's attributes with help of the [states](https://www.home-assistant.io/docs/configuration/templating/#states) template function.
   */
  set_position_template?: string;

  /**
   * The MQTT topic to publish position commands to.
   * If `set_position_topic` is used, `position_topic` should also be set.
   * Use `set_position_template` if `position_topic` wants different values than within range `position_closed` - `position_open`.
   */
  set_position_topic?: string;

  /**
   * The payload that represents the closed state.
   * Default: "closed"
   */
  state_closed?: string;

  /**
   * The payload that represents the closing state.
   * Default: "closing"
   */
  state_closing?: string;

  /**
   * The payload that represents the open state.
   * Default: "open"
   */
  state_open?: string;

  /**
   * The payload that represents the opening state.
   * Default: "opening"
   */
  state_opening?: string;

  /**
   * The payload that represents the stopped state (for covers that do not report `open`/`closed` state).
   * Default: "stopped"
   */
  state_stopped?: string;

  /**
   * The MQTT topic subscribed to receive cover state messages.
   * State topic can only read a (`open`, `opening`, `closed`, `closing` or `stopped`) state.
   * A `"None"` payload resets to an `unknown` state.
   * An empty payload is ignored.
   */
  state_topic?: string;

  /**
   * The value that will be sent on a `close_cover_tilt` command.
   * Default: 0
   */
  tilt_closed_value?: number;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * that can be used to extract the payload for the `tilt_command_topic` topic.
   * Within the template the following variables are available: `entity_id`, `tilt_position`, the target tilt position in percent; `position_open`; `position_closed`; `tilt_min`; `tilt_max`.
   * The `entity_id` can be used to reference the entity's attributes with help of the [states](https://www.home-assistant.io/docs/configuration/templating/#states) template function.
   */
  tilt_command_template?: string;

  /**
   * The MQTT topic to publish commands to control the cover tilt.
   */
  tilt_command_topic?: string;

  /**
   * The maximum tilt value.
   * Default: 100
   */
  tilt_max?: number;

  /**
   * The minimum tilt value.
   * Default: 0
   */
  tilt_min?: number;

  /**
   * The value that will be sent on an `open_cover_tilt` command.
   * Default: 100
   */
  tilt_opened_value?: number;

  /**
   * Flag that determines if tilt works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Default: `true` if `tilt_status_topic` is not defined, else `false`.
   */
  tilt_optimistic?: boolean;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that can be used to extract the payload for the `tilt_status_topic` topic.
   * Within the template the following variables are available: `entity_id`, `position_open`, `position_closed`, `tilt_min`, `tilt_max`.
   * The `entity_id` can be used to reference the entity's attributes with help of the [states](https://www.home-assistant.io/docs/configuration/templating/#states) template function.
   */
  tilt_status_template?: string;

  /**
   * The MQTT topic subscribed to receive tilt status update values.
   */
  tilt_status_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that can be used to extract the payload for the `state_topic` topic.
   */
  value_template?: string;
}
