import { BaseComponent } from './_base_component';

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
export interface ImageComponent extends BaseComponent {
  /**
   * Must be `image`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'image';

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
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Implies `force_update` of the current sensor state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   */
  json_attributes_template?: string;
}
