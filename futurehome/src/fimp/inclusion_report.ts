import { log } from '../logger';
import { sendFimpMsg } from './fimp';

export type InclusionReport = {
  address?: string | null; // Household device ID
  product_name?: string | null; // e.g. "SWITCH-ZR03-1"
  product_hash?: string | null; // e.g. "zb - eWeLink - SWITCH-ZR03-1"
  product_id?: string | null; // e.g. "SWITCH-ZR03-1"
  manufacturer_id?: string | null; // e.g. "eWeLink"
  device_id?: string | null; // e.g. "b4:0e:cf:d1:bc:2a:00:00"
  hw_ver?: string | null; // e.g. "0"
  sw_ver?: string | null; // e.g. "0x0"
  comm_tech?: string | null; // e.g. "zigbee"
  power_source?: string | null; // e.g. "battery"
  services?: InclusionReportService[] | null;
};

export type InclusionReportService = {
  name?: string | null;
  address?: string | null;
  props?: { [key: string]: any } | null;
};

export async function getInclusionReport(parameters: {
  adapterAddress: string;
  adapterService: string;
  deviceId: string;
}): Promise<InclusionReport | undefined> {
  try {
    const inclusionReport = await sendFimpMsg({
      address: parameters.adapterAddress,
      service: parameters.adapterService,
      cmd: 'cmd.thing.get_inclusion_report',
      val: parameters.deviceId,
      val_t: 'string',
    });

    return inclusionReport.val;
  } catch (e) {
    log.error(
      `Failed getting inclusion report for adapterAddress: ${parameters.adapterAddress}, adapterService: ${parameters.adapterService}, deviceId: ${parameters.deviceId}`,
      e,
    );
  }
}
