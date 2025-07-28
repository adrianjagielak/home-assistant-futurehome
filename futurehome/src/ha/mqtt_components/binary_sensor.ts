import { BaseComponent } from './_base_component';
import { BinarySensorDeviceClass } from './_enums';

/**
 * Represents a MQTT Binary Sensor component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` binary sensor platform uses an MQTT message received to set the binary sensor's state to `on`, `off` or `unknown`.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/binary_sensor.mqtt/
 */
export interface BinarySensorComponent extends BaseComponent {
  /**
   * Must be `binary_sensor`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'binary_sensor';

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
   * The string that represents the `offline` state.
   * Default: "offline"
   */
  payload_not_available?: string;
}
