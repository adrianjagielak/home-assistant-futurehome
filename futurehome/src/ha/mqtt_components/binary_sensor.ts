import { BinarySensorDeviceClass } from "./_enums";

/**
 * Represents a MQTT Binary Sensor component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` binary sensor platform uses an MQTT message received to set the binary sensor's state to `on`, `off` or `unknown`.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/binary_sensor.mqtt/
 */
export interface BinarySensorComponent {
  /**
   * Must be `binary_sensor`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'binary_sensor';

  /**
   * The [category](https://developers.home-assistant.io/docs/core/entity#generic-properties) of the entity.
   * When set, the entity category must be `diagnostic` for sensors.
   */
  entity_category?: string;

  /**
   * Picture URL for the entity.
   */
  entity_picture?: string;

  /**
   * An ID that uniquely identifies this sensor.
   * If two sensors have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id: string;

  /**
   * The MQTT topic subscribed to receive sensor's state.
   * Valid states are `OFF` and `ON`.
   * Custom `OFF` and `ON` values can be set with the `payload_off` and `payload_on` config options.
   */
  state_topic?: string;

  /**
   * Sets the [class of the device](https://www.home-assistant.io/integrations/binary_sensor/#device-class),
   * changing the device state and icon that is displayed on the frontend.
   * The `device_class` defaults to `null` (generic binary sensor).
   */
  device_class?: BinarySensorDeviceClass;

  /**
   * The string that represents the `on` state.
   * It will be compared to the message in the `state_topic` (see `value_template` for details).
   * Default: "ON"
   */
  payload_on?: string;

  /**
   * The string that represents the `off` state.
   * It will be compared to the message in the `state_topic` (see `value_template` for details).
   * Default: "OFF"
   */
  payload_off?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * that returns a string to be compared to `payload_on`/`payload_off` or an empty string,
   * in which case the MQTT message will be removed.
   * Remove this option when `payload_on` and `payload_off` are sufficient to match your payloads
   * (i.e no preprocessing of original message is required).
   */
  value_template?: string;

  /**
   * Sends update events (which results in update of [state object](https://www.home-assistant.io/docs/configuration/state_object/)'s `last_changed`)
   * even if the sensor's state hasn't changed. Useful if you want to have meaningful value graphs in history
   * or want to create an automation that triggers on *every* incoming state message (not only when the sensor's new state is different to the current one).
   * Default: false
   */
  force_update?: boolean;

  /**
   * If set, it defines the number of seconds after the sensor's state expires,
   * if it's not updated. After expiry, the sensor's state becomes `unavailable`.
   * Default the sensor's state never expires.
   */
  expire_after?: number;

  /**
   * The encoding of the payloads received.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The name of the binary sensor.
   *
   * It is recommended to set the name when entity identifiers (such as `device_class` or `state_class`)
   * do not accurately represent the purpose of the entity, to avoid showing the default 'MQTT' name.
   *
   * Default: "MQTT binary sensor"
   */
  name?: string | null;

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
   * If set, the sensor will send `off` state after this amount of seconds when the sensor only sends `on` state updates.
   */
  off_delay?: number;

  /**
   * The string that represents the `online` state.
   * Default: "online"
   */
  payload_available?: string;

  /**
   * The string that represents the `offline` state.
   * Default: "offline"
   */
  payload_not_available?: string;
}
