# Futurehome Home Assistant add-on

Futurehome add-on for Home Assistant. Designed to be a complete drop-in replacement for the official Futurehome app, with support for all device types compatible with the Futurehome hub. See the [FAQ](https://github.com/adrianjagielak/home-assistant-futurehome#faq) for more details.

![Home Assistant screenshot](https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/docs/assets/home_assistant_screenshot_dark_mode.jpg#gh-dark-mode-only)
![Home Assistant screenshot](https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/docs/assets/home_assistant_screenshot_light_mode.jpg#gh-light-mode-only)

![Pairing example](https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/docs/assets/pairing.gif)

[Watch the official add-on demo video](https://www.youtube.com/watch?v=dmEy6R49CC0)

## Features

This add-on:

* Fetches all device metadata from the Futurehome hub and maps them to Home Assistant devices/entities.
* Fetches and updates device states and availability in real time.
* Supports interaction with devices comparable to the official Futurehome app.
* Supports pairing and unpairing devices.

## Installation Guide

See the full [Installation Guide](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/docs/installation.md) for step-by-step setup instructions.

# Futurehome Device Services Compatibility Chart

This chart lists all services supported by the Futurehome hub, along with their current implementation status.

Devices commonly consist of multiple services: for example, a presence sensor might expose a `sensor_presence` service with a `presence` (true/false) value, and also a `battery` service if it is battery-powered.

Some services are more common than others; some are deprecated entirely.

| Name | Service | Example device | Implementation status | Home Assistant entity |
| --- | --- | --- | --- | --- |
| Alarm | [alarm_appliance](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_burglar](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_emergency](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_fire](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_gas](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_health](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_heat](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_lock](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_power](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_siren](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_system](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_time](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_water](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_water_valve](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts), [alarm_weather](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_alarm.ts) | [Brannvarsler](https://www.futurehome.io/en_no/shop/brannvarsler-230v) | ✅ | [Binary sensor](https://www.home-assistant.io/integrations/binary_sensor/), [Button](https://www.home-assistant.io/integrations/button/) |
| Blinds/door | [barrier_ctrl](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/barrier_ctrl.ts) | | ✅ | [Cover](https://www.home-assistant.io/integrations/cover/) |
| Battery | [battery](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/battery.ts)| | ✅ | [Sensor](https://www.home-assistant.io/integrations/sensor/), [Binary sensor](https://www.home-assistant.io/integrations/binary_sensor/) |
| Chargepoint | [chargepoint](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/chargepoint.ts) | [Futurehome Charge](https://www.futurehome.io/en_no/shop/charge) | ✅ | [Sensor](https://www.home-assistant.io/integrations/sensor/), [Switch](https://www.home-assistant.io/integrations/switch/), [Number](https://www.home-assistant.io/integrations/number/), [Select](https://www.home-assistant.io/integrations/select/) |
| Color control | [color_ctrl](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/color_ctrl.ts) | | ✅ | [Light](https://www.home-assistant.io/integrations/light/) |
| Door lock | [door_lock](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/door_lock.ts), [doorman](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/doorman.ts) | [Yale Doorman](https://www.assaabloy.com/ee/en/solutions/products/smart-locks/yale-doorman) | ✅ | [Lock](https://www.home-assistant.io/integrations/lock/), [Binary sensor](https://www.home-assistant.io/integrations/binary_sensor/), [Switch](https://www.home-assistant.io/integrations/switch/), [Number](https://www.home-assistant.io/integrations/number/), [Button](https://www.home-assistant.io/integrations/button/), [Select](https://www.home-assistant.io/integrations/select/), [Sensor](https://www.home-assistant.io/integrations/sensor/), [Text](https://www.home-assistant.io/integrations/text/) |
| Fan | [fan_ctrl](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/fan_ctrl.ts) | | ✅ | [Fan](https://www.home-assistant.io/integrations/fan/) |
| Media player | [media_player](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/media_player.ts) | | ✅ | [Select](https://www.home-assistant.io/integrations/select/), [Number](https://www.home-assistant.io/integrations/number/), [Switch](https://www.home-assistant.io/integrations/switch/), [Image](https://www.home-assistant.io/integrations/image/), [Sensor](https://www.home-assistant.io/integrations/sensor/) |
| Meter | [meter_elec](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_meter.ts), [meter_gas](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_meter.ts), [meter_water](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_meter.ts), [meter_heating](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_meter.ts), [meter_cooling](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_meter.ts) | [HAN-Sensor](https://www.futurehome.io/en/shop/han-sensor) | ✅ | [Sensor](https://www.home-assistant.io/integrations/sensor/), [Button](https://www.home-assistant.io/integrations/button/) |
| Binary switch | [out_bin_switch](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/out_bin_switch.ts) | [16A Puck Relé](https://www.futurehome.io/en_no/shop/puck-relay-16a) | ✅ | [Switch](https://www.home-assistant.io/integrations/switch/) |
| Level switch | [out_lvl_switch](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/out_lvl_switch.ts) | [Smart LED Dimmer](https://www.futurehome.io/en_no/shop/smart-led-dimmer-polar-white) | ✅ | [Light](https://www.home-assistant.io/integrations/light/), [Number](https://www.home-assistant.io/integrations/number/) |
| Button | [scene_ctrl](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/scene_ctrl.ts) | [Modusbryter](https://www.futurehome.io/en_no/shop/modeswitch-white) | ✅ | [Sensor](https://www.home-assistant.io/integrations/sensor/), [Select](https://www.home-assistant.io/integrations/select/) |
| Schedule entry | [schedule_entry](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/schedule_entry.ts) | | ✅ | [Number](https://www.home-assistant.io/integrations/number/), [Button](https://www.home-assistant.io/integrations/button/), [Binary sensor](https://www.home-assistant.io/integrations/binary_sensor/), [Sensor](https://www.home-assistant.io/integrations/sensor/) |
| Binary sensor | [sensor_contact](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_binary.ts), [sensor_presence](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_binary.ts) | | ✅ | [Binary sensor](https://www.home-assistant.io/integrations/binary_sensor/) |
| Numeric sensor | [sensor_accelx](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_accely](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_accelz](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_airflow](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_airq](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_anglepos](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_atmo](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_baro](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_co](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_co2](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_current](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_dew](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_direct](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_distance](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_elresist](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_freq](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_gp](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_gust](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_humid](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_lumin](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_moist](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_noise](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_power](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_rain](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_rotation](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_seismicint](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_seismicmag](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_solarrad](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_tank](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_temp](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_tidelvl](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_uv](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_veloc](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_voltage](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_watflow](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_watpressure](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_wattemp](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_weight](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts), [sensor_wind](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/_sensor_numeric.ts) | [Brannvarsler](https://www.futurehome.io/en_no/shop/brannvarsler-230v) | ✅ | [Sensor](https://www.home-assistant.io/integrations/sensor/) |
| Siren | [siren_ctrl](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/siren_ctrl.ts), [complex_alarm_system](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/complex_alarm_system.ts) | [Brannvarsler](https://www.futurehome.io/en_no/shop/brannvarsler-230v) | ✅ | [Siren](https://www.home-assistant.io/integrations/siren/), [Select](https://www.home-assistant.io/integrations/select/), [Number](https://www.home-assistant.io/integrations/number/), [Button](https://www.home-assistant.io/integrations/button/), [Sensor](https://www.home-assistant.io/integrations/sensor/) |
| Sound emitter | [sound_switch](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/sound_switch.ts) | | ✅ | [Siren](https://www.home-assistant.io/integrations/siren/) |
| Thermostat | [thermostat](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/thermostat.ts) | [Thermostat](https://www.futurehome.io/en_no/shop/thermostat-w) | ✅ | [Climate](https://www.home-assistant.io/integrations/climate/) |
| Keypad | [user_code](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/user_code.ts) | | ✅ | [Sensor](https://www.home-assistant.io/integrations/sensor/), [Binary sensor](https://www.home-assistant.io/integrations/binary_sensor/), [Button](https://www.home-assistant.io/integrations/button/), [Text](https://www.home-assistant.io/integrations/text/)|
| Water heater | [water_heater](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/water_heater.ts) | | ✅ | [Water heater](https://www.home-assistant.io/integrations/water_heater/) |

## Implemented system services

| Name | Service | Implementation status | Home Assistant entity |
| --- | --- | --- | --- |
| Fall-back Z-wave 'basic' service | [basic](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/basic.ts) | ✅ | [Number](https://www.home-assistant.io/integrations/number/) |
| Reboot device | [dev_sys](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/dev_sys.ts) | ✅ | [Button](https://www.home-assistant.io/integrations/button/) |
| Identify device | [indicator_ctrl](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/indicator_ctrl.ts) | ✅ | [Button](https://www.home-assistant.io/integrations/button/) |
| Advanced configuration of a device | [parameters](https://github.com/adrianjagielak/home-assistant-futurehome/blob/master/futurehome/src/services/parameters.ts) | ✅ | [Button](https://www.home-assistant.io/integrations/button/), [Sensor](https://www.home-assistant.io/integrations/sensor/), [Number](https://www.home-assistant.io/integrations/number/), [Select](https://www.home-assistant.io/integrations/select/), [Text](https://www.home-assistant.io/integrations/text/) |

<!--

## Hub

| Name | Service | Implementation status | Description |
| --- | --- | --- | --- |
| Futurehome Smarthub | gateway | ✅ | Rebooting the hub.(wip) |
| ZigBee adapter | zigbee | ✅ | Pairing and unpairing devices. |
| Z-Wave adapter | zwave-ad | ✅ | Pairing and unpairing devices. |
| Other adapters | | ✅ | Unpairing devices. |

-->

## Other system, meta, unused, or not essential services

| Service | Description |
| --- | --- |
| association | Virtual association between devices. Easily reproducible using Home Assistant's built-in configuration. |
| battery_charge_ctrl | No devices or hub support this stub service. |
| diagnostic | Diagnostic (logging, etc) |
| inverter_consumer_conn | No devices or hub support this stub service. |
| inverter_grid_conn | No devices or hub support this stub service. |
| inverter_solar_conn | No devices or hub support this stub service. |
| ota | Managing OTA updates of devices |
| power_regulator | Automation. Easily reproducible using Home Assistant's built-in configuration. |
| schedule | No devices or hub support this stub service. |
| technology_specific | Should be covered by other services |
| time | Z-wave service for setting and reading time |
| time_parameters | Z-wave service for setting and reading time |
| version | Device hardware and software versions. Exposed through other means. |
| virtual_meter_elec | A virtual electricity meter that estimates energy usage by multiplying the device's configured average power consumption with its operating duration. Easily reproducible using Home Assistant's built-in configuration. |

# FAQ

**Q: But I thought Futurehome was going to disable the local API after a short grace period, as stated in the [Subscription FAQ](https://archive.ph/UBjdJ). What gives?**

While that was initially stated, the latest hub firmware keeps the local API open indefinitely. There is currently no built-in mechanism in the firmware to disable it after a certain period, unless you update to a newer firmware. This has also been confirmed in the updated [Subscription FAQ](https://support.futurehome.no/hc/en-no/articles/28158944965277-FAQ-Subscription).

By using both public and reverse-engineered local APIs, this add-on is able to fully replicate the functionality of the Futurehome app.

