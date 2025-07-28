import { FimpResponse, sendFimpMsg } from './fimp';

export async function pollVinculum(
  component: 'device' | 'house' | 'state',
): Promise<FimpResponse> {
  return await sendFimpMsg({
    address: '/rt:app/rn:vinculum/ad:1',
    service: 'vinculum',
    cmd: 'cmd.pd7.request',
    val: { cmd: 'get', component: null, param: { components: [component] } },
    val_t: 'object',
    timeoutMs: 30000,
  });
}
