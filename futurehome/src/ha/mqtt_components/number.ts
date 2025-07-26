import { BaseComponent } from './_base_component';

/**
 * Represents a MQTT Number component for Home Assistant MQTT Discovery.
 *
 * The `mqtt` Number platform allows integrating devices that expose configuration
 * options through MQTT into Home Assistant as a Number. Every time a message under
 * the `state_topic` is received, the number entity will be updated in Home Assistant
 * and vice-versa, keeping the device and Home Assistant in sync.
 *
 * For detailed documentation see:
 * https://www.home-assistant.io/integrations/number.mqtt/
 */
export interface NumberComponent extends BaseComponent {
  /**
   * Must be `number`.
   * Only allowed and required in [MQTT auto discovery device messages](https://www.home-assistant.io/integrations/mqtt/#device-discovery-payload).
   */
  platform: 'number';

  /**
   * The MQTT topic to publish commands to change the number.
   */
  command_topic: string;

  /**
   * The MQTT topic subscribed to receive number values. An empty payload is ignored.
   */
  state_topic?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the value.
   */
  value_template?: string;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-command-templates-with-mqtt)
   * to generate the payload to send to `command_topic`.
   */
  command_template?: string;

  /**
   * Minimum value.
   * Default: 1
   */
  min?: number;

  /**
   * Maximum value.
   * Default: 100
   */
  max?: number;

  /**
   * Step value. Smallest value `0.001`.
   * Default: 1
   */
  step?: number;

  /**
   * Control how the number should be displayed in the UI. Can be set to `box` or `slider` to force a display mode.
   * Default: "auto"
   */
  mode?: string;

  /**
   * Defines the unit of measurement of the sensor, if any. The `unit_of_measurement` can be `null`.
   */
  unit_of_measurement?: string | null;

  /**
   * The [type/class](https://www.home-assistant.io/integrations/number/#device-class) of the number. The `device_class` can be `null`.
   * The `device_class` defaults to `null` (generic number).
   */
  device_class?:
    | 'apparent_power'
    | 'aqi'
    | 'area'
    | 'atmospheric_pressure'
    | 'battery'
    | 'blood_glucose_concentration'
    | 'carbon_dioxide'
    | 'carbon_monoxide'
    | 'current'
    | 'data_rate'
    | 'data_size'
    | 'distance'
    | 'duration'
    | 'energy'
    | 'energy_distance'
    | 'energy_storage'
    | 'frequency'
    | 'gas'
    | 'humidity'
    | 'illuminance'
    | 'irradiance'
    | 'moisture'
    | 'monetary'
    | 'nitrogen_dioxide'
    | 'nitrogen_monoxide'
    | 'nitrous_oxide'
    | 'ozone'
    | 'ph'
    | 'pm1'
    | 'pm25'
    | 'pm10'
    | 'power_factor'
    | 'power'
    | 'precipitation'
    | 'precipitation_intensity'
    | 'pressure'
    | 'reactive_energy'
    | 'reactive_power'
    | 'signal_strength'
    | 'sound_pressure'
    | 'speed'
    | 'sulphur_dioxide'
    | 'temperature'
    | 'volatile_organic_compounds'
    | 'volatile_organic_compounds_parts'
    | 'voltage'
    | 'volume'
    | 'volume_flow_rate'
    | 'volume_storage'
    | 'water'
    | 'weight'
    | 'wind_direction'
    | 'wind_speed'
    | null;

  /**
   * Defines a [template](https://www.home-assistant.io/docs/configuration/templating/#using-value-templates-with-mqtt)
   * to extract the JSON dictionary from messages received on the `json_attributes_topic`.
   */
  json_attributes_template?: string;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as number attributes.
   * Implies `force_update` of the current number state when a message is received on this topic.
   */
  json_attributes_topic?: string;

  /**
   * Flag that defines if number works in optimistic mode (not waiting for state update before showing the change in Home Assistant).
   * Default: `true` if no `state_topic` defined, else `false`.
   */
  optimistic?: boolean;

  /**
   * A special payload that resets the state to `unknown` when received on the `state_topic`.
   * Default: "None"
   */
  payload_reset?: string;
}
