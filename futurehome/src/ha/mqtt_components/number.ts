/**
 * Represents a MQTT Number component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` Number platform allows integrating devices that expose configuration
 * options through MQTT into Home Assistant as a Number. Every time a message under
 * the `state_topic` is received, the number entity will be updated in Home Assistant
 * and vice-versa, keeping the device and Home Assistant in sync.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/number.mqtt/
 */
export interface NumberComponent {
  /**
   * Must be `number`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'number';

  /**
   * An ID that uniquely identifies this number entity.
   * If two number entities have the same unique ID Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic to publish commands to change the number.
   */
  command_topic: string;

  /**
   * The MQTT topic subscribed to receive number values. An empty payload is ignored.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the value.
   */
  value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * Minimum value.
   * Default: 1
   */
  min?: number;

  /**
   * Maximum value.
   * Default: 100
   */
  max?: number;

  /**
   * Step value. Smallest value `0.001`.
   * Default: 1
   */
  step?: number;

  /**
   * Control how the number should be displayed in the UI. Can be set to `box` or `slider` to force a display mode.
   * Default: "auto"
   */
  mode?: string;

  /**
   * Defines the unit of measurement of the sensor, if any. The `unit_of_measurement` can be `null`.
   */
  unit_of_measurement?: string | null;

  /**
   * The [type/class](https://www.home-assistant.io/integrations/number/#device-class) of the number. The `device_class` can be `null`.
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
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as number attributes.
   * Implies `force_update` of the current number state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * Flag that defines if number works in optimistic mode.
   * Default: `true` if no `state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * A special payload that resets the state to `unknown` when received on the `state_topic`.
   * Default: "None"
   */
  payload_reset?: string;

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

  /**
   * The name of the Number. Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Number"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * A list of MQTT topics subscribed to receive availability (online/offline) updates.
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
   * The MQTT topic subscribed to receive availability (online/offline) updates.
   * Must not be used together with `availability`.
   */
  availability_topic?: string;

  /**
   * Information about the device this Number is a part of to tie it into the [device registry](https://developers.home-assistant.io/docs/en/device_registry_index.html).
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
}
