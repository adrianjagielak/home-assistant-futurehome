import { sendFimpMsg } from "../fimp/fimp";
import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function out_bin_switch__components(topicPrefix: string, vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): ServiceComponentsCreationResult {
  if (!svc.address) { return { components: {} }; }

  return {
    components: {
      [svc.address]: {
        unique_id: svc.address,
        p: 'switch',
        command_topic: `${topicPrefix}${svc.address}/command`,
        optimistic: false,//todo
        value_template: `{{ (value_json['${svc.address}'].binary) | iif('ON', 'OFF') }}`,
      },
    },
    commandHandlers: {
      [`${topicPrefix}${svc.address}/command`]: async (payload: string) => {
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
