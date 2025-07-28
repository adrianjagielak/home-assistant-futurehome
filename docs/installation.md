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

   In Home Assistant, go to **Settings > Devices & Services > Integrations** and enable **MQTT**.

5. **Add the Futurehome Add-on Repository**

   Use this link to add the custom repository to your Home Assistant:
   [Add repository](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fadrianjagielak%2Fhome-assistant-futurehome).
   Then **refresh** the page.

6. **Install the Add-on**

   * Open the **Add-on Store** and search for **"Futurehome"**.
   * Install, configure, and start the add-on.

<img src="https://raw.githubusercontent.com/adrianjagielak/home-assistant-futurehome/refs/heads/master/docs/assets/installation_ha_config.jpg" alt="Add-on config screen">

---

## Troubleshooting

**Q: My Futurehome trial expired and I can’t modify hub settings to enable Local API. What can I do?**

1. Perform a **factory reset** on the hub.
2. Open the Futurehome app, **create a new household**, and **re-add the hub**.
