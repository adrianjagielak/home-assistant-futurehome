import { AlarmControlPanelComponent } from './alarm_control_panel';
import { BinarySensorComponent } from './binary_sensor';
import { ButtonComponent } from './button';
import { CameraComponent } from './camera';
import { ClimateComponent } from './climate';
import { CoverComponent } from './cover';
import { DeviceAutomationComponent } from './device_automation';
import { DeviceTrackerComponent } from './device_tracker';
import { EventComponent } from './event';
import { FanComponent } from './fan';
import { HumidifierComponent } from './humidifier';
import { ImageComponent } from './image';
import { LawnMowerComponent } from './lawn_mower';
import { LightComponent } from './light';
import { LockComponent } from './lock';
import { ManualMqttComponent } from './manual_mqtt';
import { NotifyComponent } from './notify';
import { NumberComponent } from './number';
import { SceneComponent } from './scene';
import { SelectComponent } from './select';
import { SensorComponent } from './sensor';
import { SirenComponent } from './siren';
import { SwitchComponent } from './switch';
import { TagComponent } from './tag';
import { TextComponent } from './text';
import { UpdateComponent } from './update';
import { VacuumComponent } from './vacuum';
import { ValveComponent } from './valve';
import { WaterHeaterComponent } from './water_heater';

export type HaMqttComponent =
  | AlarmControlPanelComponent
  | BinarySensorComponent
  | ButtonComponent
  | CameraComponent
  | ClimateComponent
  | CoverComponent
  | DeviceAutomationComponent
  | DeviceTrackerComponent
  | EventComponent
  | FanComponent
  | HumidifierComponent
  | ImageComponent
  | LawnMowerComponent
  | LightComponent
  | LockComponent
  | ManualMqttComponent
  | NotifyComponent
  | NumberComponent
  | SceneComponent
  | SelectComponent
  | SensorComponent
  | SirenComponent
  | SwitchComponent
  | TagComponent
  | TextComponent
  | UpdateComponent
  | VacuumComponent
  | ValveComponent
  | WaterHeaterComponent;
