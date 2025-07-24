/**
 * Represents a MQTT Vacuum component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` vacuum integration allows you to control your MQTT-enabled vacuum.
 * The initial state of the MQTT vacuum entity is `unknown` and can be reset by sending a `null` payload as state.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/vacuum.mqtt/
 */
export interface VacuumComponent {
  /**
   * Must be `vacuum`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'vacuum';

  /**
   * An ID that uniquely identifies this vacuum.
   * If two vacuums have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;
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
   * Valid values: "all", "any", "latest".
   * Default: "latest"
   *
   * See also:
   * https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload
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
   * The MQTT topic to publish commands to control the vacuum.
   */
  command_topic?: string;

  /**
   * Information about the device this vacuum is a part of to tie it into the [device registry](https://developers.home-assistant.io/docs/core/device_registry_index/).
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

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * List of possible fan speeds for the vacuum.
   */
  fan_speed_list?: string[];

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
   * The name of the vacuum.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Vacuum"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * The payload that represents the available state.
   * Default: "online"
   */
  payload_available?: string;

  /**
   * The payload to send to the `command_topic` to begin a spot cleaning cycle.
   * Default: "clean_spot"
   */
  payload_clean_spot?: string;

  /**
   * The payload to send to the `command_topic` to locate the vacuum (typically plays a song).
   * Default: "locate"
   */
  payload_locate?: string;

  /**
   * The payload that represents the unavailable state.
   * Default: "offline"
   */
  payload_not_available?: string;

  /**
   * The payload to send to the `command_topic` to pause the vacuum.
   * Default: "pause"
   */
  payload_pause?: string;

  /**
   * The payload to send to the `command_topic` to tell the vacuum to return to base.
   * Default: "return_to_base"
   */
  payload_return_to_base?: string;

  /**
   * The payload to send to the `command_topic` to begin the cleaning cycle.
   * Default: "start"
   */
  payload_start?: string;

  /**
   * The payload to send to the `command_topic` to stop cleaning.
   * Default: "stop"
   */
  payload_stop?: string;

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
   * The MQTT topic to publish custom commands to the vacuum.
   */
  send_command_topic?: string;

  /**
   * The MQTT topic to publish commands to control the vacuum's fan speed.
   */
  set_fan_speed_topic?: string;

  /**
   * The MQTT topic subscribed to receive state messages from the vacuum.
   * Messages received on the `state_topic` must be a valid JSON dictionary,
   * with a mandatory `state` key and optionally `battery_level` and `fan_speed` keys.
   */
  state_topic?: string;

  /**
   * List of features that the vacuum supports.
   * Possible values: "start", "stop", "pause", "return_home", "battery", "status", "locate", "clean_spot", "fan_speed", "send_command".
   * Default: "start", "stop", "return_home", "status", "battery", "clean_spot"
   */
  supported_features?: string[];
}
