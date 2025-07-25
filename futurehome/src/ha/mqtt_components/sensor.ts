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
  unique_id: string;

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
   * The MQTT topic subscribed to receive sensor values.
   * If `device_class`, `state_class`, `unit_of_measurement` or `suggested_display_precision` is set,
   * and a numeric value is expected, an empty value `''` will be ignored and will not update the state,
   * a `'None'` value will set the sensor to an `unknown` state.
   *
   * If a `value_template` is used to parse a JSON payload, a `null` value in the JSON
   * [will be rendered as](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) `'None'`.
   */
  state_topic?: string;

  /**
   * The [type/class](https://www.home-assistant.io/integrations/sensor/#device-class) of the sensor to set the icon in the frontend.
   * The `device_class` defaults to `null` (generic sensor).
   */
  device_class?:
    | 'apparent_power'
    | 'aqi'
    | 'area'
    | 'atmospheric_pressure'
    | 'battery'
    | 'blood_glucose_concentration'
    | 'carbon_dioxide'
    | 'carbon_monoxide'
    | 'current'
    | 'data_rate'
    | 'data_size'
    | 'date'
    | 'distance'
    | 'duration'
    | 'energy'
    | 'energy_distance'
    | 'energy_storage'
    | 'enum'
    | 'frequency'
    | 'gas'
    | 'humidity'
    | 'illuminance'
    | 'irradiance'
    | 'moisture'
    | 'monetary'
    | 'nitrogen_dioxide'
    | 'nitrogen_monoxide'
    | 'nitrous_oxide'
    | 'ozone'
    | 'ph'
    | 'pm1'
    | 'pm25'
    | 'pm10'
    | 'power_factor'
    | 'power'
    | 'precipitation'
    | 'precipitation_intensity'
    | 'pressure'
    | 'reactive_energy'
    | 'reactive_power'
    | 'signal_strength'
    | 'sound_pressure'
    | 'speed'
    | 'sulphur_dioxide'
    | 'temperature'
    | 'timestamp'
    | 'volatile_organic_compounds'
    | 'volatile_organic_compounds_parts'
    | 'voltage'
    | 'volume'
    | 'volume_flow_rate'
    | 'volume_storage'
    | 'water'
    | 'weight'
    | 'wind_direction'
    | 'wind_speed'
    | null;

  /**
   * The [state_class](https://developers.home-assistant.io/docs/core/entity/sensor#available-state-classes) of the sensor.
   * Defaults to 'measurement'.
   *
   * Possible values:
   * - `measurement` - The state represents a measurement in present time, such as current temperature or humidity.
   * - `measurement_angle` - Like `measurement`, but specifically for angles in degrees (°), e.g., wind direction.
   * - `total` - Represents a total amount that can both increase and decrease, e.g., a net energy meter.
   * - `total_increasing` - A monotonically increasing total that periodically resets to 0, e.g., daily water consumption.
   */
  state_class?:
    | 'measurement'
    | 'measurement_angle'
    | 'total'
    | 'total_increasing';

  /**
   * Defines the units of measurement of the sensor, if any.
   * The `unit_of_measurement` defaults to `null`.
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
   *
   * It is recommended to set the name when entity identifiers (such as `device_class` or `state_class`)
   * do not accurately represent the purpose of the entity, to avoid showing the default 'MQTT' name.
   *
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
