import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Device Tracker component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` device tracker platform allows tracking devices' presence and location
 * through MQTT messages.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/device_tracker.mqtt/
 */
export interface DeviceTrackerComponent extends BaseComponent {
  /**
   * Must be `device_tracker`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'device_tracker';

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
}
