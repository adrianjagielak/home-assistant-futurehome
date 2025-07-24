/**
 * Represents a MQTT Fan component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` fan platform lets you control your MQTT enabled fans.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/fan.mqtt/
 */
export interface FanComponent {
  /**
   * Must be `fan`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'fan';

  /**
   * An ID that uniquely identifies this fan.
   * If two fans have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic to publish commands to change the fan state.
   */
  command_topic: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * A "None" payload resets to an `unknown` state.
   * An empty payload is ignored.
   * By default, valid state payloads are `OFF` and `ON`.
   * The accepted payloads can be overridden with the `payload_off` and `payload_on` config options.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract a value from the state.
   */
  state_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * The MQTT topic subscribed to receive direction state updates.
   */
  direction_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the direction state.
   */
  direction_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract a value from the direction.
   */
  direction_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `direction_command_topic`.
   */
  direction_command_template?: string;

  /**
   * The MQTT topic subscribed to receive oscillation state updates.
   */
  oscillation_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the oscillation state.
   */
  oscillation_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract a value from the oscillation.
   */
  oscillation_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `oscillation_command_topic`.
   */
  oscillation_command_template?: string;

  /**
   * The MQTT topic subscribed to receive fan speed based on percentage.
   */
  percentage_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the fan speed state based on a percentage.
   */
  percentage_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the `percentage` value from the payload received on `percentage_state_topic`.
   */
  percentage_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `percentage_command_topic`.
   */
  percentage_command_template?: string;

  /**
   * The MQTT topic subscribed to receive fan speed based on presets.
   */
  preset_mode_state_topic?: string;

  /**
   * The MQTT topic to publish commands to change the preset mode.
   */
  preset_mode_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the `preset_mode` value from the payload received on `preset_mode_state_topic`.
   */
  preset_mode_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `preset_mode_command_topic`.
   */
  preset_mode_command_template?: string;

  /**
   * List of preset modes this fan is capable of running at.
   * Common examples include `auto`, `smart`, `whoosh`, `eco` and `breeze`.
   */
  preset_modes?: string[];

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * The name of the fan.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Fan"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * Flag that defines if fan works in optimistic mode.
   * Default: `true` if no state topic defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

  /**
   * If the published message should have the retain flag on or not.
   * Default: true
   */
  retain?: boolean;

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
   * The MQTT topic subscribed to receive availability (online/offline) updates.
   * Must not be used together with `availability_topic`.
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
     * to extract device's availability from the `topic`.
     * To determine the device's availability, result of this template will be compared to `payload_available` and `payload_not_available`.
     */
    value_template?: string;
  }>;

  /**
   * When `availability` is configured, this controls the conditions needed to set the entity to `available`.
   * Valid values: "all", "any", "latest"
   * Default: "latest"
   */
  availability_mode?: 'all' | 'any' | 'latest';

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract device's availability from the `availability_topic`.
   * To determine the device's availability, result of this template will be compared to `payload_available` and `payload_not_available`.
   */
  availability_template?: string;

  /**
   * The MQTT topic subscribed to receive birth and LWT messages from the MQTT device.
   * If `availability` is not defined, the fan will always be considered `available` and its state will be as per the last command/state.
   * If `availability` is defined, the fan will be considered as `unavailable` by default.
   * Must not be used together with `availability`.
   */
  availability_topic?: string;

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
   * The payload that represents the stop state.
   * Default: "OFF"
   */
  payload_off?: string;

  /**
   * The payload that represents the running state.
   * Default: "ON"
   */
  payload_on?: string;

  /**
   * The payload that represents the oscillation off state.
   * Default: "oscillate_off"
   */
  payload_oscillation_off?: string;

  /**
   * The payload that represents the oscillation on state.
   * Default: "oscillate_on"
   */
  payload_oscillation_on?: string;

  /**
   * A special payload that resets the `percentage` state attribute to `unknown` when received at the `percentage_state_topic`.
   * Default: "None"
   */
  payload_reset_percentage?: string;

  /**
   * A special payload that resets the `preset_mode` state attribute to `unknown` when received at the `preset_mode_state_topic`.
   * Default: "None"
   */
  payload_reset_preset_mode?: string;

  /**
   * The maximum of numeric output range (representing 100 %).
   * The `percentage_step` is defined by `100` / the number of speeds within the speed range.
   * Default: 100
   */
  speed_range_max?: number;

  /**
   * The minimum of numeric output range (`off` not included, so `speed_range_min` - `1` represents 0 %).
   * The `percentage_step` is defined by `100` / the number of speeds within the speed range.
   * Default: 1
   */
  speed_range_min?: number;

  /**
   * Information about the device this fan is a part of to tie it into the [device registry](https://developers.home-assistant.io/docs/en/device_registry_index.html).
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
     * A list of IDs that uniquely identify the device.
     * For example a serial number.
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
}
