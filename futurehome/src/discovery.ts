import { MqttClient } from 'mqtt';
import { handleBattery } from './parsers/battery';
import { handleBinSwitch } from './parsers/out_bin_switch';
import { handleLvlSwitch } from './parsers/out_lvl_switch';
import { handleTempSensor } from './parsers/sensor_temp';

// map Futurehome → Home Assistant MQTT Discovery
export async function publishDiscovery(client: MqttClient, device: any) {
  console.log("Publishing a new device", device);
  for (const svc of device.services) {
    switch (svc.name) {
      case 'battery':
        handleBattery(client, device, svc);
        break;
      case 'out_bin_switch':
        handleBinSwitch(client, device, svc);
        break;
      case 'out_lvl_switch':
        handleLvlSwitch(client, device, svc);
        break;
      case 'sensor_temp':
        handleTempSensor(client, device, svc);
        break;
      default:
        // not implemented yet
    }
  }
}
