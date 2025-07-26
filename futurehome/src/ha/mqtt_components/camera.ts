import { BaseComponent } from './_base_component';

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
export interface CameraComponent extends BaseComponent {
  /**
   * Must be `camera`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'camera';

  /**
   * The MQTT topic to subscribe to.
   */
  topic: string;

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
}
