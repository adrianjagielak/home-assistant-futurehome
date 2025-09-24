import { sendFimpMsg } from '../fimp/fimp';
import {
  VinculumPd7Device,
  VinculumPd7Service,
} from '../fimp/vinculum_pd7_device';
import { haGetCachedState } from '../ha/update_state';
import {
  ServiceComponentsCreationResult,
  CommandHandlers,
} from '../ha/publish_device';
import { HaMqttComponent } from '../ha/mqtt_components/_component';

export function parameters__components(
  topicPrefix: string,
  device: VinculumPd7Device,
  svc: VinculumPd7Service,
  _svcName: string,
): ServiceComponentsCreationResult | undefined {
  const components: Record<string, HaMqttComponent> = {};
  const commandHandlers: CommandHandlers = {};
  const stateTopic = `${topicPrefix}/state`;

  // Fetch cached state for this service to discover known parameters
  const currentState = haGetCachedState({ topic: stateTopic })?.[svc.addr];
  const paramMap = currentState?.param;
  if (!paramMap) {
    // No parameters known → nothing to expose
    return;
  }

  // Single MQTT topic for setting any parameter
  const setParamTopic = `${topicPrefix}${svc.addr}/set_param/command`;

  // Iterate over each parameter in the cached state
  for (const [paramId, param] of Object.entries(paramMap)) {
    const valueType = (param as any).value_type as string;
    const uniqueId = `${svc.addr}_${paramId}`;
    const name = paramId.replace(/_/g, ' ');
    const valueTemplate = `{{ value_json['${svc.addr}'].param.${paramId}.value }}`;

    if (valueType === 'bool') {
      components[uniqueId] = {
        unique_id: uniqueId,
        platform: 'switch',
        name,
        state_topic: stateTopic,
        value_template: valueTemplate,
        command_topic: setParamTopic,
        payload_on: `{"parameter_id":"${paramId}","value_type":"${valueType}","value":true}`,
        payload_off: `{"parameter_id":"${paramId}","value_type":"${valueType}","value":false}`,
      };
    } else if (
      ['int', 'float', 'double', 'uint8', 'uint16', 'uint32'].includes(
        valueType,
      )
    ) {
      components[uniqueId] = {
        unique_id: uniqueId,
        platform: 'number',
        name,
        state_topic: stateTopic,
        value_template: valueTemplate,
        command_topic: setParamTopic,
        command_template: `{"parameter_id":"${paramId}","value_type":"${valueType}","value":{{ value }}}`,
      };
    } else {
      components[uniqueId] = {
        unique_id: uniqueId,
        platform: 'text',
        name,
        state_topic: stateTopic,
        value_template: valueTemplate,
        command_topic: setParamTopic,
      };
    }
  }

  // Single handler for all set_param commands
  commandHandlers[setParamTopic] = async (payload: string) => {
    let valObj: any;
    try {
      valObj = JSON.parse(payload);
    } catch {
      // Invalid JSON: ignore
      return;
    }
    await sendFimpMsg({
      address: svc.addr!,
      service: 'parameters',
      cmd: 'cmd.param.set',
      val: valObj,
      val_t: 'object',
    });
  };

  return {
    components,
    commandHandlers,
  };
}
