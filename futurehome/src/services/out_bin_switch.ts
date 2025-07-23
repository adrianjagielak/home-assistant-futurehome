import { sendFimpMsg } from "../fimp/fimp";
import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function out_bin_switch__components(
  topicPrefix: string,
  vinculumDeviceData: VinculumPd7Device,
  svc: InclusionReportService
): ServiceComponentsCreationResult | undefined {
  if (!svc.address) { return; }
 
  const commandTopic = `${topicPrefix}${svc.address}/command`;

  return {
    components: {
      [svc.address]: {
        unique_id: svc.address,
        p: 'switch',
        command_topic: commandTopic,
        optimistic: false,
        value_template: `{{ (value_json['${svc.address}'].binary) | iif('ON', 'OFF') }}`,
      },
    },
    commandHandlers: {
      [commandTopic]: async (payload: string) => {
        await sendFimpMsg({
          address: svc.address!,
          service: 'out_bin_switch',
          cmd: 'cmd.binary.set',
          val: payload === 'ON',
          val_t: 'bool',
        });
      },
    }
  };
}
