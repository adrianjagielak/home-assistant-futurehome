/**
 * Represents an MQTT Sensor component for Home Assistant MQTT Discovery.
 *
 * This `mqtt` sensor platform uses the MQTT message payload as the sensor value.
 * If messages in this `state_topic` are published with the *RETAIN* flag,
 * the sensor will receive an instant update with last known value.
 * Otherwise, the initial state will be undefined.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/sensor.mqtt/
 */
export interface SensorComponent {
  /**
   * Must be `sensor`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'sensor';

  /**
   * An ID that uniquely identifies this sensor.
   * If two sensors have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic subscribed to receive sensor values.
   * If `device_class`, `state_class`, `unit_of_measurement` or `suggested_display_precision` is set,
   * and a numeric value is expected, an empty value `''` will be ignored and will not update the state,
   * a `'None'` value will set the sensor to an `unknown` state.
   *
   * If a `value_template` is used to parse a JSON payload, a `null` value in the JSON
   * [will be rendered as](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) `'None'`.
   * Note that the `device_class` can be `null`.
   */
  state_topic?: string;

  /**
   * The [type/class](https://www.home-assistant.io/integrations/sensor/#device-class) of the sensor to set the icon in the frontend.
   * The `device_class` can be `null`.
   */
  device_class?: string | null;

  /**
   * The [state_class](https://developers.home-assistant.io/docs/core/entity/sensor#available-state-classes) of the sensor.
   */
  state_class?: string;

  /**
   * Defines the units of measurement of the sensor, if any.
   * The `unit_of_measurement` can be `null`.
   */
  unit_of_measurement?: string | null;

  /**
   * The number of decimals which should be used in the sensor's state after rounding.
   */
  suggested_display_precision?: number;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the value.
   * If the template throws an error, the current state will be used instead.
   */
  value_template?: string;

  /**
   * The name of the MQTT sensor.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Sensor"
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
   * The encoding of the payloads received.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

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
   * [Icon](https://www.home-assistant.io/docs/configuration/customizing-devices/#icon) for the entity.
   */
  icon?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Implies `force_update` of the current sensor state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * Sends update events even if the value hasn't changed.
   * Useful if you want to have meaningful value graphs in history.
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
   * List of allowed sensor state value. An empty list is not allowed.
   * The sensor's `device_class` must be set to `enum`.
   * The `options` option cannot be used together with `state_class` or `unit_of_measurement`.
   */
  options?: string[];

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the last_reset.
   * When `last_reset_value_template` is set, the `state_class` option must be `total`.
   * Available variables: `entity_id`. The `entity_id` can be used to reference the entity's attributes.
   */
  last_reset_value_template?: string;

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
}
