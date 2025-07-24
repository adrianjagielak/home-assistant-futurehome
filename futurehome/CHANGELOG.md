<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->


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
