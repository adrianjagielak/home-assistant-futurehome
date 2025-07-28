import { BaseComponent } from './_base_component';
import { SensorDeviceClass, SensorStateClass } from './_enums';

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
export interface SensorComponent extends BaseComponent {
  /**
   * Must be `sensor`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'sensor';

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
  device_class?: SensorDeviceClass;

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
  state_class?: SensorStateClass;

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
}
