/**
 * Represents an MQTT Alarm Control Panel component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` alarm control panel integration enables control of MQTT capable alarm panels.
 * The Alarm icon will change state after receiving updates from `state_topic`. If using the MQTT RETAIN flag,
 * the panel receives an initial state instantly. Otherwise, the initial state is `unknown`.
 *
 * Valid states accepted from the Alarm Panel (case insensitive):
 * `disarmed`, `armed_home`, `armed_away`, `armed_night`, `armed_vacation`,
 * `armed_custom_bypass`, `pending`, `triggered`, `arming`, `disarming`
 *
 * For full documentation see:
 * https://www.home-assistant.io/integrations/alarm_control_panel.mqtt/
 */
export interface AlarmControlPanelComponent {
  /**
   * Must be `alarm_control_panel`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'alarm_control_panel';

  /**
   * An ID that uniquely identifies this alarm panel.
   * If two alarm panels have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * A `None` payload resets to an `unknown` state.
   * An empty payload is ignored.
   * Valid state payloads are:
   * `armed_away`, `armed_custom_bypass`, `armed_home`, `armed_night`,
   * `armed_vacation`, `arming`, `disarmed`, `disarming`, `pending` and `triggered`.
   */
  state_topic: string;

  /**
   * The MQTT topic to publish commands to change the alarm state.
   */
  command_topic: string;

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
   * Default: "latest"
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
   * If defined, specifies a code to enable or disable the alarm in the frontend.
   * Note that the code is validated locally and blocks sending MQTT messages to the remote device.
   * For remote code validation use special values `REMOTE_CODE` (numeric code) or `REMOTE_CODE_TEXT` (text code).
   * In that case local validation is bypassed, but frontend will display a corresponding code dialog.
   * Use `command_template` to send the code to the remote device.
   */
  code?: string;

  /**
   * If true the code is required to arm the alarm. If false the code is not validated.
   * Default: true
   */
  code_arm_required?: boolean;

  /**
   * If true the code is required to disarm the alarm. If false the code is not validated.
   * Default: true
   */
  code_disarm_required?: boolean;

  /**
   * If true the code is required to trigger the alarm. If false the code is not validated.
   * Default: true
   */
  code_trigger_required?: boolean;

  /**
   * The [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * used for the command payload.
   * Available variables: `action` and `code`.
   * Default: "action"
   */
  command_template?: string;

  /**
   * Information about the device this alarm panel is a part of to tie it into the [device registry](https://developers.home-assistant.io/docs/en/device_registry_index.html).
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
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * The [category](https://developers.home-assistant.io/docs/core/entity#generic-properties) of the entity.
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
   * The name of the alarm.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Alarm"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * The payload to set armed-away mode on your Alarm Panel.
   * Default: "ARM_AWAY"
   */
  payload_arm_away?: string;

  /**
   * The payload to set armed-home mode on your Alarm Panel.
   * Default: "ARM_HOME"
   */
  payload_arm_home?: string;

  /**
   * The payload to set armed-night mode on your Alarm Panel.
   * Default: "ARM_NIGHT"
   */
  payload_arm_night?: string;

  /**
   * The payload to set armed-vacation mode on your Alarm Panel.
   * Default: "ARM_VACATION"
   */
  payload_arm_vacation?: string;

  /**
   * The payload to set armed-custom-bypass mode on your Alarm Panel.
   * Default: "ARM_CUSTOM_BYPASS"
   */
  payload_arm_custom_bypass?: string;

  /**
   * The payload that represents the available state.
   * Default: "online"
   */
  payload_available?: string;

  /**
   * The payload to disarm your Alarm Panel.
   * Default: "DISARM"
   */
  payload_disarm?: string;

  /**
   * The payload that represents the unavailable state.
   * Default: "offline"
   */
  payload_not_available?: string;

  /**
   * The payload to trigger the alarm on your Alarm Panel.
   * Default: "TRIGGER"
   */
  payload_trigger?: string;

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
   * A list of features that the alarm control panel supports.
   * The available list options are `arm_home`, `arm_away`, `arm_night`, `arm_vacation`, `arm_custom_bypass`, and `trigger`.
   * Default: ["arm_home", "arm_away", "arm_night", "arm_vacation", "arm_custom_bypass", "trigger"]
   */
  supported_features?: Array<
    | 'arm_home'
    | 'arm_away'
    | 'arm_night'
    | 'arm_vacation'
    | 'arm_custom_bypass'
    | 'trigger'
  >;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the value.
   */
  value_template?: string;
}
