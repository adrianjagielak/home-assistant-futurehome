import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import { CoverDeviceClass } from '../ha/mqtt_components/_enums';
import { CoverComponent } from '../ha/mqtt_components/cover';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';

export function barrier_ctrl__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  // Main cover component
  const commandTopic = `${topicPrefix}${svc.addr}/command`;
  const positionCommandTopic = `${topicPrefix}${svc.addr}/set_position`;
  const stopCommandTopic = `${topicPrefix}${svc.addr}/stop`;

  // Determine device class based on device type/functionality
  let deviceClass: CoverDeviceClass;
  if (
    device.type?.type === 'garage_door' ||
    device.functionality === 'security'
  ) {
    deviceClass = 'garage';
  } else if (device.type?.type === 'gate') {
    deviceClass = 'gate';
  } else if (
    device.type?.type === 'blinds' ||
    device.functionality === 'shading'
  ) {
    deviceClass = 'blind';
  } else {
    deviceClass = null;
  }
  const name = deviceClass ? undefined : 'Barrier';

  // Check if position control is supported
  const supportsPosition = svc.props?.sup_tposition === true;
  const supportedTargetStates = svc.props?.sup_tstates || [];

  const coverComponent: CoverComponent = {
    unique_id: svc.addr,
    platform: 'cover',
    device_class: deviceClass,
    name: name,
    command_topic: commandTopic,
    optimistic: false,
    value_template: `{{ value_json['${svc.addr}'].state }}`,
    // Standard Home Assistant cover payloads
    payload_open: 'OPEN',
    payload_close: 'CLOSE',
    payload_stop: 'STOP',
    state_open: 'open',
    state_closed: 'closed',
    state_opening: 'opening',
    state_closing: 'closing',
    state_stopped: 'stopped',
  };

  // Add position support if available
  if (supportsPosition) {
    coverComponent.set_position_topic = positionCommandTopic;
    coverComponent.position_template = `{{ value_json['${svc.addr}'].position | default(0) }}`;
    coverComponent.position_closed = 0;
    coverComponent.position_open = 100;
  }

  // Add stop command if supported
  if (svc.intf?.includes('cmd.op.stop')) {
    coverComponent.command_topic = stopCommandTopic;
  }

  components[svc.addr] = coverComponent;

  // Command handlers
  commandHandlers[commandTopic] = async (payload: string) => {
    let targetState: string;

    switch (payload) {
      case 'OPEN':
        targetState = 'open';
        break;
      case 'CLOSE':
        targetState = 'closed';
        break;
      case 'STOP':
        if (svc.intf?.includes('cmd.op.stop')) {
          await sendFimpMsg({
            address: svc.addr,
            service: 'barrier_ctrl',
            cmd: 'cmd.op.stop',
            val_t: 'null',
            val: null,
          });
        }
        return;
      default:
        return;
    }

    // Only send target state if it's supported
    if (supportedTargetStates.includes(targetState)) {
      await sendFimpMsg({
        address: svc.addr,
        service: 'barrier_ctrl',
        cmd: 'cmd.tstate.set',
        val_t: 'string',
        val: targetState,
      });
    }
  };

  // Position command handler (if position control is supported)
  if (supportsPosition) {
    commandHandlers[positionCommandTopic] = async (payload: string) => {
      const position = parseInt(payload, 10);
      if (Number.isNaN(position) || position < 0 || position > 100) {
        return;
      }

      // Determine target state based on position
      let targetState: string;
      if (position === 0) {
        targetState = 'closed';
      } else if (position === 100) {
        targetState = 'open';
      } else {
        // For partial positions, we'll use 'open' as the target state
        targetState = 'open';
      }

      // Only send if target state is supported
      if (supportedTargetStates.includes(targetState)) {
        await sendFimpMsg({
          address: svc.addr,
          service: 'barrier_ctrl',
          cmd: 'cmd.tstate.set',
          val_t: 'string',
          val: targetState,
          props: {
            position: position.toString(),
          },
        });
      }
    };
  }

  // Stop command handler (separate topic if needed)
  if (svc.intf?.includes('cmd.op.stop')) {
    commandHandlers[stopCommandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'barrier_ctrl',
        cmd: 'cmd.op.stop',
        val_t: 'null',
        val: null,
      });
    };
  }

  return {
    components,
    commandHandlers,
  };
}
