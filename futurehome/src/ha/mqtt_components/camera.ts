/**
 * Represents an MQTT Camera component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` camera platform allows you to integrate the content of an image file sent through MQTT into Home Assistant as a camera.
 * Every time a message under the `topic` is received, the image displayed in Home Assistant will be updated.
 * Messages received on `topic` should be the full contents of an image file, e.g., a JPEG image, without additional encoding or metadata unless `image_encoding` is used.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/camera.mqtt/
 */
export interface CameraComponent {
  /**
   * Must be `camera`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'camera';

  /**
   * An ID that uniquely identifies this camera.
   * If two cameras have the same unique ID Home Assistant will raise an exception.
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
   * The MQTT topic to subscribe to.
   */
  topic: string;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The encoding of the payloads received.
   * Set to `""` to disable decoding of incoming payload.
   * Use `image_encoding` to enable Base64 decoding on `topic`.
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
   * The encoding of the image payloads received.
   * Set to `"b64"` to enable base64 decoding of image payload.
   * If not set, the image payload must be raw binary data.
   */
  image_encoding?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Implies `force_update` of the current sensor state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * The name of the camera.
   *
   * It is recommended to set the name when entity identifiers (such as `device_class` or `state_class`)
   * do not accurately represent the purpose of the entity, to avoid showing the default 'MQTT' name.
   *
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;
}
