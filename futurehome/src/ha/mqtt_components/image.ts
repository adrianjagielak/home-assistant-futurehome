/**
 * Represents an MQTT Image component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` image platform allows you to integrate the content of an image file sent through MQTT into Home Assistant as an image.
 * The `image` platform is a simplified version of the `camera` platform that only accepts images.
 * Every time a message under the `image_topic` in the configuration is received, the image displayed in Home Assistant will also be updated.
 * Messages received on `image_topic` should contain the full contents of an image file, e.g., a JPEG image, without any additional encoding or metadata.
 *
 * Alternatively, the `url_topic` option can be used to receive an image URL for a new picture to show.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/image.mqtt/
 */
export interface ImageComponent {
  /**
   * Must be `image`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'image';

  /**
   * An ID that uniquely identifies this image.
   * If two images have the same unique ID Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

  /**
   * The MQTT topic to subscribe to receive the image payload of the image to be downloaded.
   * Ensure the `content_type` type option is set to the corresponding content type.
   * This option cannot be used together with the `url_topic` option.
   * At least one of these options (`image_topic` or `url_topic`) is required.
   */
  image_topic?: string;

  /**
   * The MQTT topic to subscribe to receive an image URL.
   * A `url_template` option can extract the URL from the message.
   * The `content_type` will be derived from the image when downloaded.
   * This option cannot be used together with the `image_topic` option.
   * At least one of these options (`url_topic` or `image_topic`) is required.
   */
  url_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the image URL from a message received at `url_topic`.
   */
  url_template?: string;

  /**
   * The content type of an image data message received on `image_topic`.
   * This option cannot be used with the `url_topic` because the content type is derived when downloading the image.
   * Default: "image/jpeg"
   */
  content_type?: string;

  /**
   * The encoding of the image payloads received.
   * Set to `"b64"` to enable base64 decoding of image payload.
   * If not set, the image payload must be raw binary data.
   */
  image_encoding?: string;

  /**
   * The encoding of the payloads received.
   * Set to `""` to disable decoding of incoming payload.
   * Use `image_encoding` to enable `Base64` decoding on `image_topic`.
   * Default: "utf-8"
   */
  encoding?: string;

  /**
   * Flag which defines if the entity should be enabled when first added.
   * Default: true
   */
  enabled_by_default?: boolean;

  /**
   * The name of the image.
   * Can be set to `null` if only the device name is relevant.
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Implies `force_update` of the current sensor state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   */
  json_attributes_template?: string;

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
   * Information about the device this image is a part of to tie it into the [device registry](https://developers.home-assistant.io/docs/en/device_registry_index.html).
   * Only works through [MQTT discovery](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery) and when [`unique_id`](#unique_id) is set.
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
}
