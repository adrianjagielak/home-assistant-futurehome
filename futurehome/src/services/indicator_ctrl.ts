import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';
import {
  CommandHandlers,
  ServiceComponentsCreationResult,
} from '../ha/publish_device';

export function indicator_ctrl__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};

  if (svc.intf?.includes('cmd.indicator.set_visual_element')) {
    const commandTopic = `${topicPrefix}${svc.addr}/cmd.indicator.set_visual_element/command`;

    components[`${svc.addr}/set_visual_element`] = {
      unique_id: `${svc.addr}/set_visual_element`,
      platform: 'button',
      entity_category: 'diagnostic',
      device_class: 'identify',
      command_topic: commandTopic,
    };

    commandHandlers[commandTopic] = async (_payload: string) => {
      await sendFimpMsg({
        address: svc.addr,
        service: 'indicator_ctrl',
        cmd: 'cmd.indicator.set_visual_element',
        val_t: 'null',
        val: null,
        props: {
          duration: '3',
        },
      });
    };
  }

  // cmd.indicator.set_text is not used anymore

  // since cmd.indicator.set_visual_element should always be present when cmd.indicator.identify is,
  // there's no need to handle cmd.indicator.identify separately.

  return {
    components,
    commandHandlers,
  };
}
