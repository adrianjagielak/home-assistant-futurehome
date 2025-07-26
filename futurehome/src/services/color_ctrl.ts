import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { LightComponent } from '../ha/mqtt_components/light';
import {
  ServiceComponentsCreationResult,
  CommandHandlers,
} from '../ha/publish_device';

export function color_ctrl__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const supComponents: string[] = svc.props?.sup_components ?? [];

  if (!supComponents.length) {
    return undefined; // No supported components, nothing to expose
  }

  // Check if we have RGB support (minimum requirement for a useful light)
  const hasRgb =
    supComponents.includes('red') &&
    supComponents.includes('green') &&
    supComponents.includes('blue');
  if (!hasRgb) {
    return undefined; // No RGB support, skip this service
  }

  // Determine supported color modes based on available components
  const supportedColorModes: string[] = [];

  if (hasRgb) {
    supportedColorModes.push('rgb');
  }

  // Check for color temperature support (Zigbee style with 'temp' component)
  if (supComponents.includes('temp')) {
    supportedColorModes.push('color_temp');
  }

  // Check for dual-white support (Z-Wave style with warm_w and cold_w)
  if (supComponents.includes('warm_w') && supComponents.includes('cold_w')) {
    supportedColorModes.push('color_temp');
  }

  // Command topics
  const commandTopic = `${topicPrefix}${svc.addr}/command`;
  const rgbCommandTopic = `${topicPrefix}${svc.addr}/rgb/command`;
  const colorTempCommandTopic = `${topicPrefix}${svc.addr}/color_temp/command`;

  // State topic (shared with other components of the same device)
  const stateTopic = `${topicPrefix}/state`;

  // Create the light component configuration
  const lightComponent: LightComponent = {
    unique_id: svc.addr,
    platform: 'light',
    name: 'Light',

    // Basic on/off control
    command_topic: commandTopic,
    state_topic: stateTopic,
    state_value_template: `{{ 'ON' if (value_json['${svc.addr}'].color.red > 0 or value_json['${svc.addr}'].color.green > 0 or value_json['${svc.addr}'].color.blue > 0) else 'OFF' }}`,

    // RGB color control
    rgb_command_topic: rgbCommandTopic,
    rgb_state_topic: stateTopic,
    rgb_value_template: `{{ value_json['${svc.addr}'].color.red }},{{ value_json['${svc.addr}'].color.green }},{{ value_json['${svc.addr}'].color.blue }}`,

    // Brightness support (derived from RGB values)
    brightness_state_topic: stateTopic,
    brightness_value_template: `{{ [value_json['${svc.addr}'].color.red, value_json['${svc.addr}'].color.green, value_json['${svc.addr}'].color.blue] | max }}`,

    optimistic: false,
  };

  // Add color temperature support if available
  if (supportedColorModes.includes('color_temp')) {
    if (supComponents.includes('temp')) {
      // Zigbee style - direct temperature value in Kelvin
      lightComponent.color_temp_command_topic = colorTempCommandTopic;
      lightComponent.color_temp_state_topic = stateTopic;
      lightComponent.color_temp_value_template = `{{ (1000000 / value_json['${svc.addr}'].temp) | round(0) }}`; // Convert Kelvin to mireds
      lightComponent.min_mireds = 153; // ~6500K
      lightComponent.max_mireds = 370; // ~2700K
    } else if (
      supComponents.includes('warm_w') &&
      supComponents.includes('cold_w')
    ) {
      // Z-Wave style - warm/cold white mix
      lightComponent.color_temp_command_topic = colorTempCommandTopic;
      lightComponent.color_temp_state_topic = stateTopic;
      // Estimate color temperature from warm_w/cold_w ratio
      lightComponent.color_temp_value_template = `{{ (153 + (217 * (value_json['${svc.addr}'].warm_w / (value_json['${svc.addr}'].warm_w + value_json['${svc.addr}'].cold_w + 0.001)))) | round(0) }}`;
      lightComponent.min_mireds = 153; // ~6500K (cold)
      lightComponent.max_mireds = 370; // ~2700K (warm)
    }
  }

  // Command handlers
  const commandHandlers: CommandHandlers = {
    // Basic on/off command
    [commandTopic]: async (payload: string) => {
      if (payload === 'ON') {
        // Turn on with white color (all components at max)
        const colorMap: Record<string, number> = {
          red: 255,
          green: 255,
          blue: 255,
        };

        await sendFimpMsg({
          address: svc.addr!,
          service: 'color_ctrl',
          cmd: 'cmd.color.set',
          val_t: 'int_map',
          val: colorMap,
        });
      } else if (payload === 'OFF') {
        // Turn off (all components to 0)
        const colorMap: Record<string, number> = {};
        supComponents.forEach((component) => {
          colorMap[component] = 0;
        });

        await sendFimpMsg({
          address: svc.addr!,
          service: 'color_ctrl',
          cmd: 'cmd.color.set',
          val_t: 'int_map',
          val: colorMap,
        });
      }
    },

    // RGB color command
    [rgbCommandTopic]: async (payload: string) => {
      const parts = payload.split(',');
      if (parts.length !== 3) return;

      const red = parseInt(parts[0], 10);
      const green = parseInt(parts[1], 10);
      const blue = parseInt(parts[2], 10);

      if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue))
        return;
      if (
        red < 0 ||
        red > 255 ||
        green < 0 ||
        green > 255 ||
        blue < 0 ||
        blue > 255
      )
        return;

      const colorMap: Record<string, number> = {
        red,
        green,
        blue,
      };

      await sendFimpMsg({
        address: svc.addr!,
        service: 'color_ctrl',
        cmd: 'cmd.color.set',
        val_t: 'int_map',
        val: colorMap,
      });
    },
  };

  // Add color temperature command handler if supported
  if (supportedColorModes.includes('color_temp')) {
    commandHandlers[colorTempCommandTopic] = async (payload: string) => {
      const mireds = parseInt(payload, 10);
      if (Number.isNaN(mireds) || mireds < 153 || mireds > 370) return;

      if (supComponents.includes('temp')) {
        // Zigbee style - convert mireds to Kelvin
        const kelvin = Math.round(1000000 / mireds);

        const colorMap: Record<string, number> = {
          temp: kelvin,
        };

        await sendFimpMsg({
          address: svc.addr!,
          service: 'color_ctrl',
          cmd: 'cmd.color.set',
          val_t: 'int_map',
          val: colorMap,
        });
      } else if (
        supComponents.includes('warm_w') &&
        supComponents.includes('cold_w')
      ) {
        // Z-Wave style - convert mireds to warm/cold white mix
        // Linear interpolation between cold (153 mireds) and warm (370 mireds)
        const warmRatio = (mireds - 153) / (370 - 153);
        const coldRatio = 1 - warmRatio;

        const colorMap: Record<string, number> = {
          warm_w: Math.round(warmRatio * 255),
          cold_w: Math.round(coldRatio * 255),
          // Turn off RGB when using white
          red: 0,
          green: 0,
          blue: 0,
        };

        await sendFimpMsg({
          address: svc.addr!,
          service: 'color_ctrl',
          cmd: 'cmd.color.set',
          val_t: 'int_map',
          val: colorMap,
        });
      }
    };
  }

  return {
    components: {
      [svc.addr]: lightComponent,
    },
    commandHandlers,
  };
}
