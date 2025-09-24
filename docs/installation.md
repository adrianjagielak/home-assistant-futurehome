# Installation Guide

## Step 1: Configure the Futurehome App

1. **Enable Local API**

   Open the Futurehome app and navigate to:
   **Settings > My household > Smarthub**, then set up **Local API**.

   <img src="https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/docs/assets/installation_local_api.jpg" alt="Local API screen" width="200">

3. **(Optional) Install Thingsplex Integration**

   Thingsplex is an integration for debugging hub adapters. It's also used by this add-on to support pairing and unpairing devices.

   * Go to **Settings > Integrations**, install and start **"Thingsplex Advanced UI"**.
   * Open the integration’s **"..."** menu, set a **username** and **password**, then **save**.

   <img src="https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/docs/assets/installation_thingsplex.jpg" alt="Thingsplex screen" width="200">

4. **(Optional but recommended) Block WAN Access**
   To prevent future firmware updates that might break local functionality, block the hub’s internet access via your router settings.

---

## Step 2: Set Up in Home Assistant

4. **Enable MQTT Integration**

   Add the MQTT integration by going to **Settings → Devices & Services → Integrations → Add integration**, search for and select **MQTT → MQTT**, then choose **"Use the official Mosquitto MQTT Broker add-on"**.

5. **Install the Futurehome Add-on**

   Click the button below to install the Futurehome add-on in your Home Assistant:
   
   [![Open your Home Assistant instance and show the dashboard of an add-on.](https://my.home-assistant.io/badges/supervisor_addon.svg)](https://my.home-assistant.io/redirect/supervisor_addon/?addon=6b454d71_futurehome&repository_url=https%3A%2F%2Fgithub.com%2Fadrianjagielak%2Fhome-assistant-futurehome)
   
   Finally, configure and start the add-on.

<img src="https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/docs/assets/installation_ha_config.jpg" alt="Add-on config screen">

---

## Troubleshooting

**Q: My Futurehome trial expired and I can’t modify hub settings to enable Local API. What can I do?**

1. Perform a **factory reset** on the hub.
2. Open the Futurehome app, **create a new household**, and **re-add the hub**.
