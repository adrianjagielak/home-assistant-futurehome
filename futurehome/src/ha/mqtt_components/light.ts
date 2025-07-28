import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Light component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` light platform lets you control your MQTT enabled lights through one of the supported message schemas,
 * `default`, `json` or `template`.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/light.mqtt/
 */
export interface LightComponent extends BaseComponent {
  /**
   * Must be `light`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'light';

  /**
   * Flag that defines if light supports brightness when the `rgb`, `rgbw`, or `rgbww` color mode is supported.
   * Only for JSON schema.
   * Default: false
   */
  brightness?: boolean;

  /**
   * Defines the maximum brightness value (i.e., 100%) of the MQTT device.
   * Default: 255
   */
  brightness_scale?: number;

  /**
   * The MQTT topic to publish commands to change the light’s brightness.
   * Only for default schema.
   */
  brightness_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `brightness_command_topic`.
   * Available variables: `value`.
   * Only for default schema.
   */
  brightness_command_template?: string;

  /**
   * The MQTT topic subscribed to receive brightness state updates.
   * Only for default schema.
   */
  brightness_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the brightness value.
   * Only for default schema.
   */
  brightness_value_template?: string;

  /**
   * The flag that defines if the light works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Optimistic mode means the light immediately changes state after command,
   * without waiting for confirmation from state topic.
   * Default: `true` if no state topic defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * The MQTT topic to publish commands to change the light’s color temperature state.
   * Default range: 153 to 500 mireds or if `color_temp_kelvin` true: 2000 to 6535 Kelvin.
   * Only for default schema.
   */
  color_temp_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `color_temp_command_topic`.
   * Available variables: `value`.
   * Only for default schema.
   */
  color_temp_command_template?: string;

  /**
   * The MQTT topic subscribed to receive color temperature state updates.
   * Only for default schema.
   */
  color_temp_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the color temperature value.
   * Only for default schema.
   */
  color_temp_value_template?: string;

  /**
   * When set to `true`, color temperature commands and states are in Kelvin units.
   * When not set, values are converted to/from mireds.
   * Default: false
   */
  color_temp_kelvin?: boolean;

  /**
   * The MQTT topic subscribed to receive color mode updates.
   * If not configured, `color_mode` is auto set based on last color/type received.
   * Only for default schema.
   */
  color_mode_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the color mode value.
   * Only for default schema.
   */
  color_mode_value_template?: string;

  /**
   * The MQTT topic to publish commands to change the light's effect state.
   */
  effect_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `effect_command_topic`.
   * Available variables: `value`.
   */
  effect_command_template?: string;

  /**
   * The list of effects the light supports.
   */
  effect_list?: string[];

  /**
   * The MQTT topic subscribed to receive effect state updates.
   */
  effect_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the effect value.
   */
  effect_value_template?: string;

  /**
   * Flag that defines if the light supports effects.
   * Only for JSON schema.
   * Default: false
   */
  effect?: boolean;

  /**
   * Flag that defines if light supports the flash feature.
   * Only for JSON schema.
   * Default: true
   */
  flash?: boolean;

  /**
   * The duration, in seconds, of a “long” flash.
   * Only for JSON schema.
   * Default: 10
   */
  flash_time_long?: number;

  /**
   * The duration, in seconds, of a “short” flash.
   * Only for JSON schema.
   * Default: 2
   */
  flash_time_short?: number;

  /**
   * The MQTT topic to publish commands to change the light color in HS format (Hue Saturation).
   * Range Hue: 0° .. 360°, Saturation: 0..100.
   * Note: Brightness is sent separately to `brightness_command_topic`.
   * Only for default schema.
   */
  hs_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `hs_command_topic`.
   * Available variables: `hue`, `sat`.
   */
  hs_command_template?: string;

  /**
   * The MQTT topic subscribed to receive HS color state updates.
   * Expected payload example: `359.5,100.0`.
   * Note: Brightness is received separately in the `brightness_state_topic`.
   */
  hs_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the HS color value.
   */
  hs_value_template?: string;

  /**
   * The MQTT topic to publish commands to change the light's RGB state.
   */
  rgb_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `rgb_command_topic`.
   * Available variables: `red`, `green`, `blue`.
   */
  rgb_command_template?: string;

  /**
   * The MQTT topic subscribed to receive RGB state updates.
   * Expected payload example: `255,0,127`.
   */
  rgb_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the RGB value.
   */
  rgb_value_template?: string;

  /**
   * The MQTT topic to publish commands to change the light's RGBW state.
   */
  rgbw_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `rgbw_command_topic`.
   * Available variables: `red`, `green`, `blue`, `white`.
   */
  rgbw_command_template?: string;

  /**
   * The MQTT topic subscribed to receive RGBW state updates.
   * Expected payload example: `255,0,127,64`.
   */
  rgbw_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the RGBW value.
   */
  rgbw_value_template?: string;

  /**
   * The MQTT topic to publish commands to change the light's RGBWW state.
   */
  rgbww_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `rgbww_command_topic`.
   * Available variables: `red`, `green`, `blue`, `cold_white`, `warm_white`.
   */
  rgbww_command_template?: string;

  /**
   * The MQTT topic subscribed to receive RGBWW state updates.
   * Expected payload example: `255,0,127,64,32`.
   */
  rgbww_state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the RGBWW value.
   */
  rgbww_value_template?: string;

  /**
   * The MQTT topic to publish commands to change the light to white mode with a given brightness.
   */
  white_command_topic?: string;

  /**
   * Defines the maximum white level (i.e., 100%) of the MQTT device.
   * Used when setting the light to white mode.
   * Default: 255
   */
  white_scale?: number;

  /**
   * The MQTT topic subscribed to receive the state updates in MQTT default or JSON format.
   * For default schema: expected payloads are `ON`, `OFF` or `None` (unknown).
   * For JSON schema: expected payload is a JSON object with different keys.
   * For template schema: format flexible.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the state value from the `state_topic`.
   */
  state_value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the state value from the `state_topic`.
   * In template schema, called `state_template`.
   */
  state_template?: string;

  /**
   * The MQTT topic to publish commands to change the switch state.
   */
  command_topic: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-template-configuration).
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   * Usage example can be found in [MQTT sensor](https://www.home-assistant.io/integrations/sensor.mqtt/#json-attributes-topic-configuration).
   */
  json_attributes_topic?: string;

  /**
   * The maximum color temperature in Kelvin.
   * Default: 6535
   */
  max_kelvin?: number;

  /**
   * The minimum color temperature in Kelvin.
   * Default: 2000
   */
  min_kelvin?: number;

  /**
   * The maximum color temperature in mireds.
   */
  max_mireds?: number;

  /**
   * The minimum color temperature in mireds.
   */
  min_mireds?: number;

  /**
   * The payload that represents the off state.
   * Default: "OFF"
   */
  payload_off?: string;

  /**
   * The payload that represents the on state.
   * Default: "ON"
   */
  payload_on?: string;

  /**
   * The schema to use.
   * Must be one of `basic` (default), `json`, or `template`.
   */
  schema?: 'basic' | 'json' | 'template';

  /**
   * Defines when `payload_on` is sent.
   * Options:
   *  - `last`: send style topics first (brightness, color, etc), then `payload_on` to `command_topic`.
   *  - `first`: send `payload_on` first, then style topics.
   *  - `brightness`: only send brightness commands instead of `payload_on` to turn light on.
   * Only for default schema.
   */
  on_command_type?: 'last' | 'first' | 'brightness';

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * for *on* state changes.
   * Available variables: `state`, `brightness`, `color_temp`, `red`, `green`, `blue`, `hue`, `sat`, `flash`, `transition`, `effect`.
   */
  command_on_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * for *off* state changes.
   * Available variables: `state`, `transition`.
   */
  command_off_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract blue color from the state payload value.
   * Expected result is an integer in 0-255 range.
   */
  blue_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract brightness from the state payload value.
   * Expected result is an integer in 0-255 range.
   */
  brightness_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract color temperature from the state payload value.
   * Expected result is an integer. Interpreted in Kelvin if `color_temp_kelvin` true, else mireds.
   */
  color_temp_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the effect from the state payload value.
   */
  effect_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract green color from the state payload value.
   * Expected result is an integer in 0-255 range.
   */
  green_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract red color from the state payload value.
   * Expected result is an integer in 0-255 range.
   */
  red_template?: string;

  /**
   * Used in template schema: A [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the XY color from the state payload value.
   */
  xy_value_template?: string;

  /**
   * The MQTT topic to publish commands to change the light's XY state.
   */
  xy_command_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to compose message which will be sent to `xy_command_topic`.
   * Available variables: `x`, `y`.
   */
  xy_command_template?: string;

  /**
   * The MQTT topic subscribed to receive XY state updates.
   * Expected payload example: `0.675,0.322`.
   */
  xy_state_topic?: string;
}
