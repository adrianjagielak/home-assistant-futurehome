/**
 * Represents a MQTT Cover component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` cover platform allows you to control an MQTT cover (such as blinds, a roller shutter or a garage door).
 *
 * A cover entity can be in states (`open`, `opening`, `closed`, `closing` or `stopped`).
 * See the full documentation at https://www.home-assistant.io/integrations/cover.mqtt/
 */
export interface CoverComponent {
  /**
   * Must be `cover`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'cover';

  /**
   * An ID that uniquely identifies this cover.
   * If two covers have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id: string;

  /**
   * A list of MQTT topics subscribed to receive availability (online/offline) updates.
   * Must not be used together with `availability_topic`.
   *
   * Each item describes:
   * - topic: An MQTT topic subscribed to receive availability (online/offline) updates.
   * - payload_available: The payload that represents the available state. Default: "online"
   * - payload_not_available: The payload that represents the unavailable state. Default: "offline"
   * - value_template: Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   *   to extract device's availability from the `topic`. To determine the device's availability,
   *   the result of this template will be compared to `payload_available` and `payload_not_available`.
   *
   * See https://www.home-assistant.io/integrations/mqtt/ for more info on availability.
   */
  availability?: Array<{
    /**
     * An MQTT topic subscribed to receive availability (online/offline) updates.
     */
    topic: string;

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
     * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
     * to extract device's availability from the `topic`. To determine the device's availability,
     * the result of this template will be compared to `payload_available` and `payload_not_available`.
     */
    value_template?: string;
  }>;

  /**
   * When `availability` is configured, this controls the conditions needed to set the entity to `available`.
   * Valid values: `all`, `any`, `latest`.
   * Default: "latest"
   *
   * - "all": `payload_available` must be received on all configured availability topics before the entity is marked as online.
   * - "any": `payload_available` must be received on at least one configured availability topic before the entity is marked as online.
   * - "latest": The last `payload_available` or `payload_not_available` received on any configured availability topic controls the availability.
   */
  availability_mode?: 'all' | 'any' | 'latest';

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract device's availability from the `availability_topic`. To determine the device's availability,
   * the result of this template will be compared to `payload_available` and `payload_not_available`.
   */
  availability_template?: string;

  /**
   * The subscribed-to MQTT topic to receive birth and LWT messages from the MQTT cover device.
   * If an `availability` topic is not defined, the cover availability state will always be `available`.
   * If an `availability` topic is defined, the cover availability state will be `unavailable` by default.
   * Must not be used together with `availability`.
   */
  availability_topic?: string;

  /**
   * The MQTT topic to publish commands to control the cover.
   */
  command_topic?: string;

  /**
   * Information about the device this cover is a part of to tie it into the [device registry](https://developers.home-assistant.io/docs/en/device_registry_index.html).
   * Only works when [`unique_id`](#unique_id) is set.
   * At least one of identifiers or connections must be present to identify the device.
   */
  device?: {
    /**
     * A link to the webpage that can manage the configuration of this device.
     * Can be either an `http://`, `https://` or an internal `homeassistant://` URL.
     */
    configuration_url?: string;

    /**
     * A list of connections of the device to the outside world as a list of tuples `[connection_type, connection_identifier]`.
     * For example the MAC address of a network interface:
     * `"connections": [["mac", "02:5b:26:a8:dc:12"]]`.
     */
    connections?: Array<[string, string]>;

    /**
     * The hardware version of the device.
     */
    hw_version?: string;

    /**
     * A list of IDs that uniquely identify the device. For example a serial number.
     */
    identifiers?: string[];

    /**
     * The manufacturer of the device.
     */
    manufacturer?: string;

    /**
     * The model of the device.
     */
    model?: string;

    /**
     * The model identifier of the device.
     */
    model_id?: string;

    /**
     * The name of the device.
     */
    name?: string;

    /**
     * The serial number of the device.
     */
    serial_number?: string;

    /**
     * Suggest an area if the device isn’t in one yet.
     */
    suggested_area?: string;

    /**
     * The firmware version of the device.
     */
    sw_version?: string;

    /**
     * Identifier of a device that routes messages between this device and Home Assistant.
     * Examples of such devices are hubs, or parent devices of a sub-device.
     * This is used to show device topology in Home Assistant.
     */
    via_device?: string;
  };

  /**
   * Sets the [class of the device](https://www.home-assistant.io/integrations/cover/#device_class),
   * changing the device state and icon that is displayed on the frontend.
   * The `device_class` can be `null`.
   */
  device_class?: string | null;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
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
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-template-configuration) documentation.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-topic-configuration) documentation.
   */
  json_attributes_topic?: string;

  /**
   * The name of the cover.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Cover"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * Flag that defines if switch works in optimistic mode.
   * Default: `false` if `state_topic` or `position_topic` defined, else `true`.
   */
  optimistic?: boolean;

  /**
   * The payload that represents the online state.
   * Default: "online"
   */
  payload_available?: string;

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
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

  /**
   * Defines if published messages should have the retain flag set.
   * Default: false
   */
  retain?: boolean;

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
   * Flag that determines if tilt works in optimistic mode.
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
