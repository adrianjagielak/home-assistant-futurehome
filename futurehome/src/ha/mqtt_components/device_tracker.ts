/**
 * Represents a MQTT Device Tracker component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` device tracker platform allows tracking devices' presence and location
 * through MQTT messages.
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
   * The [category](https://developers.home-assistant.io/docs/core/entity#generic-properties) of the entity.
   */
  entity_category?: string;

  /**
   * Picture URL for the entity.
   */
  entity_picture?: string;

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
   * [Icon](https://www.home-assistant.io/docs/configuration/customizing-devices/#icon) for the entity.
   *
   * The icon must be a Material Design Icons (MDI) string identifier, for example: `mdi:thermometer`, `mdi:battery`, or `mdi:water`.
   *
   * It is recommended to set the icon when the default icon or other entity identifiers (such as `device_class` or `state_class`)
   * do not accurately represent the purpose of the entity. In most cases, relying on the automatic icon selection ensures better consistency
   * and compatibility with future updates.
   */
  icon?: string;
}
