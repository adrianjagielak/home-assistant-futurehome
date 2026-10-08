<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 1.9.1 (08.10.2026)

- Fix water/fire/gas/heat alarms getting stuck active. Devices clear these with a single "idle" notification, which the hub sometimes files under a different event than the one raised (e.g. `level_drop: deactiv` after `leak: activ`), so the leak sensor stayed on forever. For these single-hazard alarm services a newer `deactiv` report now clears all events, both in the polled state (using the hub's timestamps) and for live reports. Multi-hazard services such as `alarm_burglar` are unchanged (by [@espensgr](https://github.com/espensgr)).
- Numeric sensor templates no longer error (flooding the log) when a device advertises a sensor service it never reports, e.g. `sensor_accelx/y/z` and `sensor_seismicint` on Øye; the entity keeps its current state (by [@espensgr](https://github.com/espensgr)).
- Fix device availability: `evt.network.all_nodes_report` identifies nodes by their adapter address (e.g. Z-Wave node ID), which was used as the device ID. Devices were shown as available/unavailable based on an unrelated node's status (e.g. a lock marked unavailable because a flood sensor was down). Node addresses are now mapped to devices via `fimp.adapter`/`fimp.address`, and stale availability topics published under node addresses are removed (by [@espensgr](https://github.com/espensgr)).
- Sleeping battery devices (`SLEEP` status) are no longer marked unavailable (by [@espensgr](https://github.com/espensgr)).
- Request the Z-Wave node report on startup and every 5 minutes, so availability is correct without waiting for the hub to send it (by [@espensgr](https://github.com/espensgr)).
- Fix the lock "Access Granted"/"Last Access" entities reading a non-existent `access_report` attribute; access reports are stored under `usercode` (by [@espensgr](https://github.com/espensgr)).
- Fix lock alarm sensors (e.g. "RF Lock", "Keypad Lock") erroring and staying unknown until that event has occurred; they now report `off` (by [@espensgr](https://github.com/espensgr)).
- Fix the user code "Clear User" text input receiving the whole device state JSON as its value ("state is too long") (by [@espensgr](https://github.com/espensgr)).
- Fix schedule "Slot Active"/"Active Schedule Count" always reporting off/0 due to Jinja loop scoping (by [@espensgr](https://github.com/espensgr)).
- Alarm and schedule templates no longer error (flooding the log) when a device has not reported that service; the entity keeps its current state (by [@espensgr](https://github.com/espensgr)).

## 1.8.0 (01.07.2026)

- Expose the battery maintenance status (e.g. `replace_now`) as a diagnostic "Battery status" sensor for devices that support the `replace_*` battery events. Previously this was not surfaced at all, so a device could report a full battery level while actually needing its battery replaced.

## 1.7.0 (01.07.2026)

- Added support for the Futurehome house mode (Home/Away/Sleep/Vacation). The current mode is exposed as a `Mode` selector on the Smarthub device, updates in real time (e.g. when a Futurehome Modeswitch button is pressed), and can be changed from Home Assistant.
- Scene controllers (`scene_ctrl`, e.g. the Futurehome Modeswitch) now also expose an [`Event`](https://www.home-assistant.io/integrations/event/) entity, so momentary button presses can trigger automations (the previous `Scene` sensor was stuck on `unknown` and could not react to repeated presses).

## 1.6.2 (16.05.2026)

- Fix invalid device_class + unit_of_measurement combinations for HA 2026.5 (#32).

## 1.6.1 (16.10.2025)

- Tweaked 'Ignore Availability Reports' setting.

## 1.6.0 (16.10.2025)

- Added setting to always treat all devices as up.

## 1.5.0 (16.10.2025)

- Reverted: Add ability to specify a custom MQTT broker.

## 1.4.0 (13.10.2025)

- Added ability to specify a custom MQTT broker.

## 1.3.1 (28.09.2025)

- Revert upgrading dependencies.

## 1.3.0 (28.09.2025)

- Upgrade dependencies.
- Use proper `light` entity for out_lvl_switch if the device type is "light", instead of generic `number` level switch (thanks @Andbli for help!).

## 1.2.1 (26.09.2025)

- Revert 'Use `light` entity for out_lvl_switch if the device type is "light"'.

## 1.2.0 (26.09.2025)

- Use `light` entity for out_lvl_switch if the device type is "light".

## 1.1.2 (24.09.2025)

- Bumped dependencies (#1, #2, #6).

## 1.1.1 (24.09.2025)

- Added error handling for invalid FIMP messages.
- Updated installation.md - clarified that users must select the MQTT Integration instead of the hub’s MQTT server, with step-by-step guidance provided (@Andbli).

## 1.1.0 (24.09.2025)

- Stop inclusion/exclusion after the first device is added/removed, just like in the official app.
- Add configuration checkbox for allowing empty Thingsplex credentials (#3).
- Improved GUI security by hiding passwords by default (#4, #5) (thanks @Andbli !).

## 1.0.2 (16.09.2025)

- Added logging the initial devices response.

## 1.0.1 (28.07.2025)

- Updated README.md.

## 1.0.0 (28.07.2025)

**Initial stable release**

## 0.1.15 (28.07.2025)

- Added updated installation guide.

## 0.1.10 (28.07.2025)

- Allowed unpairing of devices using any adapter.

## 0.1.9 (28.07.2025)

- Added icon.

## 0.1.8 (28.07.2025)

- Added logo.
- Added support for pairing new devices.
- Added support for unpairing devices.
- Fixed using the unit reported by the numerical sensor.
- Added restarting the add-on when disconnected from the hub or Home Assistant
- Updated demo mode data.
- Added more delays when initializing the demo mode.

## 0.1.7 (26.07.2025)

- Added setting for enabling debug log.
- Reset all devices each time when starting in demo mode.

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
- Added support for 'parameters' service (advanced configuration of a device).
- Hide the fallback 'basic' Z-Wave service unless it is the only service present.

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

## 0.1.0 (24.07.2025)

**Initial beta release**

* Integration with Futurehome hub: maps all device metadata to Home Assistant devices/entities.
* Real-time updates for device states and availability.
* Device control features aligned with the official Futurehome app.
* Supports most Futurehome services (see [README](https://github.com/adrianjagielak/home-assistant-futurehome) for details) (enough to be useful! 🎉).

## 0.0.1 (21.07.2025) - 0.0.38 (24.07.2025)

- Development.
