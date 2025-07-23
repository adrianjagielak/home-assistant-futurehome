import { sendFimpMsg } from "../fimp/fimp";
import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function out_lvl_switch__components(
  topicPrefix: string,
  vinculumDeviceData: VinculumPd7Device,
  svc: InclusionReportService
): ServiceComponentsCreationResult | undefined {
  if (!svc.address) { return; }

  const commandTopic = `${topicPrefix}${svc.address}/command`;

  const minLvl = svc.props?.min_lvl ?? 0;
  const maxLvl = svc.props?.max_lvl ?? 100;

  return {
    components: {
      [svc.address]: {
        unique_id: svc.address,
        p: "number",
        min: minLvl,
        max: maxLvl,
        step: 1,
        command_topic: commandTopic,
        optimistic: false,
        value_template: `{{ value_json['${svc.address}'].lvl }}`,
      },
    },

    commandHandlers: {
      [commandTopic]: async (payload: string) => {
        const lvl = parseInt(payload, 10);
        if (Number.isNaN(lvl)) {
          return;
        }

        await sendFimpMsg({
          address: svc.address!,
          service: "out_lvl_switch",
          cmd: "cmd.lvl.set",
          val: lvl,
          val_t: "int",
        });
      },
    },
  };
}
