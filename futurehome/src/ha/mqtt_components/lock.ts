import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Lock component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` lock platform lets you control your MQTT enabled locks.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/lock.mqtt/
 */
export interface LockComponent extends BaseComponent {
  /**
   * Must be `lock`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'lock';

  /**
   * The MQTT topic to publish commands to change the lock state.
   */
  command_topic: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * It accepts states configured with `state_jammed`, `state_locked`, `state_unlocked`, `state_locking` or `state_unlocking`.
   * A "None" payload resets to an `unknown` state.
   * An empty payload is ignored.
   */
  state_topic?: string;

  /**
   * A regular expression to validate a supplied code when it is set during the action to `open`, `lock` or `unlock` the MQTT lock.
   */
  code_format?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   * The lock command template accepts the parameters `value` and `code`.
   * The `value` parameter will contain the configured value for either `payload_open`, `payload_lock` or `payload_unlock`.
   * The `code` parameter is set during the action to `open`, `lock` or `unlock` the MQTT lock and will be set `None` if no code was passed.
   */
  command_template?: string;

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
   * Flag that defines if lock works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Default: `true` if no `state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * The payload sent to the lock to lock it.
   * Default: "LOCK"
   */
  payload_lock?: string;

  /**
   * The payload sent to the lock to unlock it.
   * Default: "UNLOCK"
   */
  payload_unlock?: string;

  /**
   * The payload sent to the lock to open it.
   */
  payload_open?: string;

  /**
   * A special payload that resets the state to `unknown` when received on the `state_topic`.
   * Default: '"None"'
   */
  payload_reset?: string;

  /**
   * The payload sent to `state_topic` by the lock when it's jammed.
   * Default: "JAMMED"
   */
  state_jammed?: string;

  /**
   * The payload sent to `state_topic` by the lock when it's locked.
   * Default: "LOCKED"
   */
  state_locked?: string;

  /**
   * The payload sent to `state_topic` by the lock when it's locking.
   * Default: "LOCKING"
   */
  state_locking?: string;

  /**
   * The payload sent to `state_topic` by the lock when it's unlocked.
   * Default: "UNLOCKED"
   */
  state_unlocked?: string;

  /**
   * The payload sent to `state_topic` by the lock when it's unlocking.
   * Default: "UNLOCKING"
   */
  state_unlocking?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract a state value from the payload.
   */
  value_template?: string;
}
