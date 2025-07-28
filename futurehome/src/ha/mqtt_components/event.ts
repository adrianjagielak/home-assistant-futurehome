import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Event component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` event platform allows you to process event info from an MQTT message. Events are signals that are emitted when something happens,
 * for example, when a user presses a physical button like a doorbell or when a button on a remote control is pressed.
 * With the event some event attributes can be sent to become available as an attribute on the entity.
 * MQTT events are stateless. For example, a doorbell does not have a state like being "on" or "off" but instead is momentarily pressed.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/event.mqtt/
 */
export interface EventComponent extends BaseComponent {
  /**
   * Must be `event`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'event';

  /**
   * The MQTT topic subscribed to receive JSON event payloads.
   * The JSON payload should contain the `event_type` element.
   * The event type should be one of the configured `event_types`.
   * Note that replayed retained messages will be discarded.
   */
  state_topic: string;

  /**
   * A list of valid `event_type` strings.
   */
  event_types: string[];

  /**
   * The [type/class](https://www.home-assistant.io/integrations/event/#device-class) of the event to set the icon in the frontend.
   * The `device_class` defaults to `null`.
   */
  device_class?: string | null;

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
   * The name to use when displaying this event.
   * Default: "MQTT Event"
   */
  name?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the value and render it to a valid JSON event payload.
   * If the template throws an error, the current state will be used instead.
   */
  value_template?: string;
}
