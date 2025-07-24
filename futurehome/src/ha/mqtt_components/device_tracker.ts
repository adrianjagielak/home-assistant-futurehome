/**
 * Represents a MQTT Device Tracker component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` device tracker platform allows tracking devices' presence and location
 * through MQTT messages. It supports tracking using state topics and/or JSON attributes topics,
 * with optional availability topics for device online/offline state reporting.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/device_tracker.mqtt/
 */
export interface DeviceTrackerComponent {
  /**
   * Must be `device_tracker`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'device_tracker';

  /**
   * An ID that uniquely identifies this device tracker.
   * If two device trackers have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id: string;

  /**
   * The MQTT topic subscribed to receive device tracker state changes.
   * The states defined in `state_topic` override the location states defined by the `json_attributes_topic`.
   * This state override is turned inactive if the `state_topic` receives a message containing `payload_reset`.
   * The `state_topic` can only be omitted if `json_attributes_topic` is used.
   * An empty payload is ignored.
   * Valid payloads are `not_home`, `home` or any other custom location or zone name.
   * Payloads for `not_home`, `home` can be overridden with the `payload_not_home` and `payload_home` config options.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that returns a device tracker state.
   */
  value_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary message containing device tracker attributes.
   *
   * This topic can be used to set the location of the device tracker under the following conditions:
   * - If the attributes in the JSON message include `longitude`, `latitude`, and `gps_accuracy` (optional).
   * - If the device tracker is within a configured [zone](https://www.home-assistant.io/integrations/zone/).
   *
   * If these conditions are met, it is not required to configure `state_topic`.
   *
   * Be aware that any location message received at `state_topic` overrides the location received via `json_attributes_topic` until a message configured with `payload_reset` is received at `state_topic`.
   *
   * For a more generic usage example of the `json_attributes_topic`, refer to the [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-topic-configuration) documentation.
   */
  json_attributes_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-template-configuration) documentation.
   */
  json_attributes_template?: string;

  /**
   * The name of the MQTT device_tracker.
   */
  name?: string;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

  /**
   * Attribute of a device tracker that affects state when being used to track a [person](https://www.home-assistant.io/integrations/person/).
   * Valid options are `gps`, `router`, `bluetooth`, or `bluetooth_le`.
   */
  source_type?: 'gps' | 'router' | 'bluetooth' | 'bluetooth_le' | string;

  /**
   * The payload value that represents the 'home' state for the device.
   * Default: "home"
   */
  payload_home?: string;

  /**
   * The payload value that represents the 'not_home' state for the device.
   * Default: "not_home"
   */
  payload_not_home?: string;

  /**
   * The payload value that will have the device's location automatically derived from Home Assistant's zones.
   * Default: '"None"'
   */
  payload_reset?: string;

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
   * The MQTT topic subscribed to receive birth and LWT messages from the MQTT device.
   * If `availability` is not defined, the device tracker will always be considered `available`.
   * Must not be used together with `availability`.
   */
  availability_topic?: string;

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
   * Valid values: "all", "any", "latest".
   * Default: "latest".
   *
   * When set to `all`, `payload_available` must be received on all configured availability topics before the entity is marked as online.
   * When set to `any`, `payload_available` must be received on at least one configured availability topic before the entity is marked as online.
   * When set to `latest`, the last `payload_available` or `payload_not_available` received on any configured availability topic controls the availability.
   */
  availability_mode?: 'all' | 'any' | 'latest';

  /**
   * Information about the device this device tracker is a part of that ties it into the [device registry](https://developers.home-assistant.io/docs/en/device_registry_index.html).
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
   * [Icon](https://www.home-assistant.io/docs/configuration/customizing-devices/#icon) for the entity.
   */
  icon?: string;
}
