/**
 * Represents an MQTT Update component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` update platform allows integration of devices exposing firmware or software installed and latest versions through MQTT.
 * Each message received under configured topics updates the entity state in Home Assistant.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/update.mqtt/
 */
export interface UpdateComponent {
  /**
   * Must be `update`.
   * Required and only allowed in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'update';

  /**
   * An ID that uniquely identifies this update entity.
   * If two update entities have the same unique ID, Home Assistant will raise an exception.
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
   * The MQTT topic subscribed to receive state updates.
   * The payload may be JSON or a simple string with `installed_version` value.
   * When JSON, the payload can include: `installed_version`, `latest_version`, `title`, `release_summary`, `release_url`, `entity_picture`, `in_progress` (boolean), and `update_percentage` (number).
   */
  state_topic?: string;

  /**
   * The MQTT topic subscribed to receive an update of the latest version.
   * Use `state_topic` with `latest_version_template` if all update state values are in a single JSON payload.
   */
  latest_version_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the latest version value.
   * Use with `latest_version_topic` or `state_topic`.
   */
  latest_version_template?: string;

  /**
   * The MQTT topic to publish `payload_install` to start the installation process.
   */
  command_topic?: string;

  /**
   * The MQTT payload to start installing process.
   */
  payload_install?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt) to extract the `installed_version` state value or to render to a valid JSON payload from the payload received on `state_topic`.
   */
  value_template?: string;

  /**
   * The type/class of the update to set the icon in the frontend.
   * See [device classes](https://www.home-assistant.io/integrations/update/#device-classes).
   * Defaults to `null`.
   */
  device_class?: string | null;

  /**
   * Number of decimal digits for display of update progress.
   * Default: 0
   */
  display_precision?: number;

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
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as entity attributes.
   * Implies `force_update` of the current select state when receiving a message on this topic.
   */
  json_attributes_topic?: string;

  /**
   * The name of the Update. Can be set to `null` if only the device name is relevant.
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * A summary of the release notes or changelog.
   * Suitable for a brief update description (max 255 characters).
   */
  release_summary?: string;

  /**
   * URL to the full release notes of the latest version available.
   */
  release_url?: string;

  /**
   * Flag if the published message should have the retain flag on or not.
   * Default: false
   */
  retain?: boolean;

  /**
   * Title of the software or firmware update.
   * Helps differentiate between device/entity name and the update software title.
   */
  title?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * Default: 0
   */
  qos?: number;

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
