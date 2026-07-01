import { FimpResponse, sendFimpMsg } from './fimp';

export async function pollVinculum(
  component: 'device' | 'house' | 'state' | 'mode',
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

/**
 * Changes the current Futurehome house mode (e.g. "home", "away", "sleep",
 * "vacation") through the Vinculum service.
 *
 * Mirrors the reference `primefimp` `ChangeMode` implementation, which issues a
 * `cmd.pd7.request` with `{ cmd: "set", component: "mode", id: <mode> }`.
 */
export async function setVinculumMode(mode: string): Promise<FimpResponse> {
  return await sendFimpMsg({
    address: '/rt:app/rn:vinculum/ad:1',
    service: 'vinculum',
    cmd: 'cmd.pd7.request',
    val: { cmd: 'set', component: 'mode', id: mode },
    val_t: 'object',
  });
}
