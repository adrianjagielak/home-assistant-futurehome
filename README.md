# Futurehome Home Assistant add-on

Futurehome add-on for Home Assistant. Designed to be a complete drop-in replacement for the official Futurehome app, with support for all device types compatible with the Futurehome hub.

![Home Assistant screenshot](https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/assets/home_assistant_screenshot_dark_mode.jpg#gh-dark-mode-only)
![Home Assistant screenshot](https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/assets/home_assistant_screenshot_light_mode.jpg#gh-light-mode-only)

## Features

This add-on:

* Fetches all device metadata from the Futurehome hub and maps them to Home Assistant devices/entities.
* Fetches and updates device states and availability in real time.
* Supports interaction with devices comparable to the official Futurehome app.
* Supports pairing of new Zigbee, Z-Wave, and Futurehome devices (work-in-progress).
  (If you’ve previously used third-party integrations—e.g. Philips Hue—you can still interact with those devices, as long as they're paired with the hub. However, it's generally recommended to use the appropriate Home Assistant integration directly for such devices.)

<!--
todo: pairing
-->

## Installation

1. In the Futurehome app, go to Smarthub settings and [enable Local API](https://support.futurehome.no/hc/no/articles/360033256491-Local-API-access-over-MQTT-Beta).
2. (Optional but highly recommended) Block the hub’s internet (WAN) access in your router settings to prevent future firmware updates.
3. In Home Assistant, enable the **MQTT** integration.
4. [Add this add-on repository to Home Assistant](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fadrianjagielak%2Fhome-assistant-futurehome) and refresh the page.
5. Open the **Add-on Store** and search for "Futurehome".
6. Install, configure, and start the Futurehome add-on.

# Futurehome Device Services Compatibility Chart

This chart lists all services supported by the Futurehome hub, along with their current implementation status.

Devices commonly consist of multiple services: for example, a presence sensor might expose a `sensor_presence` service with a `presence` (true/false) value, and also a `battery` service if it is battery-powered.

Some services are more common than others; some are deprecated entirely.

<!--
todo: links to the .ts service implementations below
-->

<!--
| alarm_appliance | | |
| alarm_burglar | | |
| alarm_emergency | | |
| alarm_fire | | |
| alarm_gas | | |
| alarm_health | | |
| alarm_heat | | |
| alarm_lock | | |
| alarm_power | | |
| alarm_siren | | |
| alarm_system | | |
| alarm_time | | |
| alarm_water | | |
| alarm_water_valve | | |
| alarm_weather | | |
 -->

| Service | Example device | Implementation status |
| --- | --- | --- |
| _alarms_ services | [Brannvarsler](https://www.futurehome.io/en_no/shop/brannvarsler-230v) | |
| barrier_ctrl | | ✅ |
| basic | | ✅ |
| battery | | ✅ |
| chargepoint | [Futurehome Charge](https://www.futurehome.io/en_no/shop/charge) | ✅ |
| color_ctrl | | ✅ |
| complex_alarm_system | | |
| door_lock | | |
| doorman | | |
| fan_ctrl | | ✅ |
| light | | ✅ |
| media_player | | ✅ |
| meter_elec | [HAN-Sensor](https://www.futurehome.io/en/shop/han-sensor) | |
| out_bin_switch | [16A Puck Relé](https://www.futurehome.io/en_no/shop/puck-relay-16a) | ✅ |
| out_lvl_switch | [Smart LED Dimmer](https://www.futurehome.io/en_no/shop/smart-led-dimmer-polar-white) | ✅ |
| power_regulator | [16A Puck Relé](https://www.futurehome.io/en_no/shop/puck-relay-16a) | |
| scene_ctrl | [Modusbryter](https://www.futurehome.io/en_no/shop/modeswitch-white) | ✅ |
| sensor_accelx | | ✅ |
| sensor_accely | | ✅ |
| sensor_accelz | | ✅ |
| sensor_airflow | | ✅ |
| sensor_airq | | ✅ |
| sensor_anglepos | | ✅ |
| sensor_atmo | | ✅ |
| sensor_baro | | ✅ |
| sensor_co | | ✅ |
| sensor_co2 | | ✅ |
| sensor_contact | | ✅ |
| sensor_current | | ✅ |
| sensor_dew | | ✅ |
| sensor_direct | | ✅ |
| sensor_distance | | ✅ |
| sensor_elresist | | ✅ |
| sensor_freq | | ✅ |
| sensor_gp | | ✅ |
| sensor_gust | | ✅ |
| sensor_humid | | ✅ |
| sensor_lumin | | ✅ |
| sensor_moist | | ✅ |
| sensor_noise | | ✅ |
| sensor_power | | ✅ |
| sensor_presence | | ✅ |
| sensor_rain | | ✅ |
| sensor_rotation | | ✅ |
| sensor_seismicint | | ✅ |
| sensor_seismicmag | | ✅ |
| sensor_solarrad | | ✅ |
| sensor_tank | | ✅ |
| sensor_temp | | ✅ |
| sensor_tidelvl | | ✅ |
| sensor_uv | | ✅ |
| sensor_veloc | | ✅ |
| sensor_voltage | | ✅ |
| sensor_watflow | | ✅ |
| sensor_watpressure | | ✅ |
| sensor_wattemp | | ✅ |
| sensor_weight | | ✅ |
| sensor_wind | | ✅ |
| siren_ctrl | | |
| thermostat | [Thermostat](https://www.futurehome.io/en_no/shop/thermostat-w) | ✅ |
| user_code | | |
| water_heater | | ✅ |

## Services that are deprecated, unused, or removed in newer versions of the system.

| Service | Description |
| --- | --- |
| appliance | |
| blinds | Replaced by barrier_ctrl |
| boiler | Replaced by water_heater |
| fan | Replaced by fan_ctrl|
| fire_detector | Replaced by alarm_fire|
| garage_door | Replaced by barrier_ctrl|
| gas_detector | Replaced by alarm_gas |
| gate | Replaced by barrier_ctrl |
| heat_detector | |
| heat_pump | |
| heater | |
| input | |
| leak_detector | |
| meter | |
| meter_cooling | |
| meter_gas | |
| meter_heating | |
| meter_water | |
| schedule | Not recognized by the official app |
| schedule_entry | Not recognized by the official app |
| sensor | |
| siren | Replaced by siren_ctrl|
| sound_switch | Not recognized by the official app |
| time_parameters | Not recognized by the official app |
| water_valve | |

## Virtual, unnecessary services (easily reproduced in stock Home Assistant)

| Service | Description |
| --- | --- |
| virtual_meter_elec | A virtual electricity meter that estimates energy usage by multiplying the device's configured average power consumption with its operating duration. |

## System or meta, not essential services

| Service | Implementation status | Description |
| --- | --- | --- |
| gateway | | |
| association | | |
| diagnostic | | |
| indicator_ctrl | ✅ | Identify devices |
| ota | | |
| parameters | | |
| technology_specific | | |
| time | | |
| version | | |
| dev_sys | | |
