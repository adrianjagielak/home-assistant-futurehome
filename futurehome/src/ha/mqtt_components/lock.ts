/**
 * Represents a MQTT Lock component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` lock platform lets you control your MQTT enabled locks.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/lock.mqtt/
 */
export interface LockComponent {
  /**
   * Must be `lock`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'lock';

  /**
   * An ID that uniquely identifies this lock.
   * If two locks have the same unique ID, Home Assistant will raise an exception.
   * Required when used with device-based discovery.
   */
  unique_id?: string;

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
   * The name of the lock.
   * Can be set to `null` if only the device name is relevant.
   * Default: "MQTT Lock"
   */
  name?: string | null;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   */
  object_id?: string;

  /**
   * Flag that defines if lock works in optimistic mode.
   * Default: `true` if no `state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * The payload that represents the available state.
   * Default: "online"
   */
  payload_available?: string;

  /**
   * The payload sent to the lock to lock it.
   * Default: "LOCK"
   */
  payload_lock?: string;

  /**
   * The payload that represents the unavailable state.
   * Default: "offline"
   */
  payload_not_available?: string;

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
