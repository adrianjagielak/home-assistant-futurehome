import { MqttClient } from "mqtt/*";
import { v4 as uuidv4 } from "uuid";
import { log } from "../logger";

let fimp: MqttClient | undefined = undefined;

export function setFimp(client: MqttClient) {
  fimp = client;
}

export type FimpResponse = {
  corid?: any;
  ctime?: any;
  props?: any;
  serv?: any;
  tags?: any;
  type?: string | null;
  uid?: any;
  val?: any;
  val_t?: string;
  ver?: any;
};

export async function sendFimpMsg({
  address,
  service,
  cmd,
  val,
  val_t,
  timeoutMs = 10000,
}: {
  address: string;
  service: string;
  cmd: string;
  val: unknown;
  val_t: string;
  timeoutMs?: number;
}): Promise<FimpResponse> {
  const uid = uuidv4();
  const topic = `pt:j1/mt:cmd${address}`;
  const message = JSON.stringify(
    {
      corid: null,
      ctime: new Date().toISOString(),
      props: {},
      resp_to: 'pt:j1/mt:rsp/rt:app/rn:ha-futurehome/ad:addon',
      serv: service,
      src: 'ha-futurehome',
      tags: [],
      'type': cmd,
      uid: uid,
      val: val,
      val_t: val_t,
      ver: '1',
    },
  );

  // For example for "cmd.foo.set" we would expect to get "evt.foo.report" back (plus the service name must match).
  let possibleResponseType: string | null = null;
  if (cmd.split('.').length === 3) {
    possibleResponseType = cmd.split('.').map(
      (part, index, array) => index === 0 ? 'evt' : (index === array.length - 1 ? 'report' : part),
    ).join('.');
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      fimp?.removeListener('message', onResponse);
      let error = new Error(`Timeout waiting for FIMP response (uid: ${uid}, service: ${service}, cmd: ${cmd})`);
      log.warn(error.message, error.stack);
      reject(error);
    }, timeoutMs);

    const onResponse = (topic: string, buffer: any) => {
      const msg = JSON.parse(buffer.toString());

      if (msg.corid === uid) {
        if (msg.type === 'evt.error.report') {
          fimp?.removeListener('message', onResponse);

          let error = new Error(`Received FIMP response for message ${uid}: error (evt.error.report) (matched using uid)`);
          log.warn(error.message, error.stack);
          reject(error);
          return;
        }

        log.debug(`Received FIMP response for message ${uid} (matched using uid).`);

        clearTimeout(timeout);
        fimp?.removeListener('message', onResponse);
        resolve(msg);
        return;
      }

      if (msg.topic === `pt:j1/mt:evt${address}`) {
        if (msg.type === 'evt.error.report') {
          fimp?.removeListener('message', onResponse);

          let error = new Error(`Received FIMP response for message ${uid}: error (evt.error.report) (matched using topic)`);
          log.warn(error.message, error.stack);
          reject(error);
          return;
        }

        log.debug(`Received FIMP response for message ${uid} (matched using topic).`);

        clearTimeout(timeout);
        fimp?.removeListener('message', onResponse);
        resolve(msg);
        return;
      }

      // TODO(adrianjagielak): is this needed?
      // if (possibleResponseType != null && msg.type === possibleResponseType && msg.serv === parameters.service) {
      //   log.debug(`Received FIMP response for message ${uid} (matched using possible response type "${possibleResponseType}").`);
      //
      //   clearTimeout(timeout);
      //   effectiveMqttClient.removeListener('message', onResponse);
      //   resolve(msg);
      //   return;
      // }

      const hasValidType = msg.type != null && msg.type.startsWith('evt.');
      const msgParts = msg.type?.split('.') ?? [];
      const cmdParts = cmd.split('.');
      const hasThreeParts = msgParts.length === 3 && cmdParts.length === 3;
      const middlePartMatches = msgParts[1] === cmdParts[1];
      const endsWithLastPart = cmd.endsWith(msgParts.at(-1)!);
      const sameService = msg.serv === service;
      if (hasValidType && hasThreeParts && middlePartMatches && endsWithLastPart && sameService) {
        log.debug(`Received FIMP response for message ${uid} (matched using event name).`);

        clearTimeout(timeout);
        fimp?.removeListener('message', onResponse);
        resolve(msg);
        return;
      }
    };

    fimp?.on('message', onResponse);

    log.debug(`
Sending FIMP message:
address: "${address}",
service: "${service}",
uid: "${uid}",
cmd: "${cmd}",
val: "${JSON.stringify(val)}",
val_t: "${val_t}"
`);

    fimp?.publish(topic, message, { qos: 1 });
  });
}