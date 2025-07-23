import { InclusionReportService } from "../fimp/inclusion_report";
import { VinculumPd7Device } from "../fimp/vinculum_pd7_device";
import { ServiceComponentsCreationResult } from "../ha/publish_device";

export function out_lvl_switch__components(topicPrefix: string, vinculumDeviceData: VinculumPd7Device, svc: InclusionReportService): ServiceComponentsCreationResult {
  if (!svc.address) { return {components: {}}; }

  return {
    components: {
    // [svc.address]: {
    //   p: 'sensor',
    //   device_class: 'temperature",
    //   unit_of_measurement: "°C",
    //   value_template: `{{ value_json['${svc.address}'].sensor }}`,
    // },
  },};
}
