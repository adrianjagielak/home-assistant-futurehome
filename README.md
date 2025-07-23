# Futurehome Home Assistant add-on

Futurehome add-on for Home Assistant. The add-on aims to be a complete drop-in replacement for the official Futurehome app, implementing support for all Futurehome-supported device types.

## Features

This plugin:

* Fetches all devices metadata from Futurehome hub and maps them to Home Assistant Devices/Entities.
* Fetches and updates devices state.
* Fetches and updates devices availability.
* Supports interacting with the devices as well as the official Futurehome app did.
* Supports pairing new Zigbee/Z-Wave/Futurehome devices (if an offchance you used any third party integration like Phillips Hue you will be able to interact with it as long as its paired with the hub. However it's recommended to directly use the appropriate Home Asisstant integration for such devices).

## Installation

1. Configure Local API in Smarthub settings in Futurehome app.
2. Block internet access (WAN) for the hub in your router settings (optional, but strongly recommended to block any future hub firmware updates).
4. In Home Assistant enable MQTT integration.
5. [![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fadrianjagielak%2Fhome-assistant-futurehome)
6. Search for "Futurehome" in add-on store.
7. Install, configure, and run Futurehome add-on.


# Futurehome Device Services Compatibility Chart

This chart lists all services supported by the Futurehome hub, along with their current implementation status.  

Devices commonly consist of multiple services: for example, a presence sensor might expose a `sensor_presence` service with a `presence` (true/false) value, and also a `battery` service if it is battery-powered.

Some services are more common than others. Some are deprecated entirely.


todo periodical refresh of devices
todo periodical refresh of state
todo handle evt.sensor.report

| Service | Example device | Implementation status |
| --- | --- | --- |
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
| appliance | | |
| barrier_ctrl | | |
| basic | | |
| battery | | ✅ |
| blinds | | |
| boiler | | |
| chargepoint | [Futurehome Charge](https://www.futurehome.io/en_no/shop/charge) | |
| color_ctrl | | |
| complex_alarm_system | | |
| door_lock | |  |
| doorman | | |
| fan | | |
| fan_ctrl | | |
| fire_detector | | |
| garage_door | | |
| gas_detector | | |
| gate | | |
| gateway | | |
| heat_detector | | |
| heat_pump | | |
| heater | | |
| input | | |
| leak_detector | | |
| light | | |
| media_player | | |
| meter | | |
| meter_elec | [HAN-Sensor](https://www.futurehome.io/en/shop/han-sensor) | |
| meter_gas | | |
| meter_water | | |
| out_bin_switch | | ✅ |
| out_lvl_switch | [Smart LED Dimmer](https://www.futurehome.io/en_no/shop/smart-led-dimmer-polar-white) | ✅ |
| power_regulator | | |
| scene_ctrl | | |
| sensor | | |
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
| siren | | |
| siren_ctrl | | |
| thermostat | [Thermostat](https://www.futurehome.io/en_no/shop/thermostat-w) | |
| user_code | | |
| virtual_meter_elec | | |
| water_heater | | |
| water_valve | | |
| association | | |
| diagnostic | | |
| indicator_ctrl | | |
| ota | | |
| parameters | | |
| dev_sys | | |
| technology_specific | | |
| time | | |
| version | | |


todo add demo mode checkbox? sample data
<!--

Notes to developers after forking or using the github template feature:
  - Make sure you adjust the 'version' key in 'example/config.yaml' when you do that.
  - Make sure you update 'example/CHANGELOG.md' when you do that.
  - The first time this runs you might need to adjust the image configuration on github container registry to make it public
  - You may also need to adjust the github Actions configuration (Settings > Actions > General > Workflow > Read & Write)
- Adjust the 'image' key in 'example/config.yaml' so it points to your username instead of 'home-assistant'.
  - This is where the build images will be published to.
- Rename the example directory.
  - The 'slug' key in 'example/config.yaml' should match the directory name.
- Adjust all keys/url's that points to 'home-assistant' to now point to your user/fork.
- Do awesome stuff!
 -->

