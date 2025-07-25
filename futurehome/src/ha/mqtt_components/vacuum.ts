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
   * The MQTT topic to publish commands to control the vacuum.
   */
  command_topic?: string;

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
   *
   * It is recommended to set the name when entity identifiers (such as `device_class` or `state_class`)
   * do not accurately represent the purpose of the entity, to avoid showing the default 'MQTT' name.
   *
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
