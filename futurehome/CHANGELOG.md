<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 0.1.6 (26.07.2025)

- Improved MQTT components interfaces.
- Refactored sensors.
- Added support for 'meter_*' services (electricity meters, gas meters, water meters, heating meters, cooling meters).
- Added support for 'sound_switch' service (sound emitters).
- Added support for 'door_lock' service (door locks).
- Added support for 'user_code' service (keypads).
- Added support for 'schedule_entry' service (for scheduling access).
- Added support for 'doorman' service (Yale door locks).
- Added support for 'complex_alarm_system' service (part of alarm sirens control).
- Added support for 'dev_sys' service (reboot device).

## 0.1.5 (25.07.2025)

- Added support for 'alarm_*' services (alarms).

## 0.1.4 (25.07.2025)

- Added support for 'media_player' service.
- Removed demo mode 'optimistic' override causing switches to look weird.
- Updated demo mode fake state handling.
- Added support for 'siren_ctrl' service (alarm sirens).

## 0.1.3 (25.07.2025)

- Added support for 'chargepoint' service (EV chargers).
- Updated demo mode data to add thermostat with dual setpoint system (heat+cool).
- Added default entities names.

## 0.1.2 (24.07.2025)

- Added support for 'water_heater' service (devices such as water boiler or a water tank).
- Updated demo mode data.
- Added extracting device manufacturer name.
- Updated 'thermostat' service implementation.
- Added logic to skip redundant services already represented by higher-level entities (e.g., sensor_temp/thermostat, sensor_wattemp/water_heater).

## 0.1.1 (24.07.2025)

- Set 'battery' entity category to 'diagnostic' to hide it from the main HA view.
- Do not expose 'battery' entity twice if it supports both level and low/high binary state.
- Changed the default 'sensor_lumin' unit from 'Lux' to 'lx'.
- Added support for 'indicator_ctrl' service (identify devices).
- Added support for 'barrier_ctrl' service (devices like garage doors, barriers, and window shades).

# 0.1.0 (24.07.2025)

**Initial stable release**

* Integration with Futurehome hub: maps all device metadata to Home Assistant devices/entities.
* Real-time updates for device states and availability.
* Device control features aligned with the official Futurehome app.
* Supports most Futurehome services (see [README](https://github.com/adrianjagielak/home-assistant-futurehome) for details) (enough to be useful! 🎉).

## 0.0.1 (21.07.2025) - 0.0.38 (24.07.2025)

- Development.
