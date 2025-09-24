import { v4 as uuidv4 } from 'uuid';
import { log } from '../logger';
import { IMqttClient } from '../mqtt/interface';

let fimp: IMqttClient | undefined = undefined;

export function setFimp(client: IMqttClient) {
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
  val_t?: FimpValueType;
  ver?: any;
};

export type FimpValueType =
  | 'string'
  | 'int'
  | 'float'
  | 'bool'
  | 'null'
  | 'str_array'
  | 'int_array'
  | 'float_array'
  | 'str_map'
  | 'int_map'
  | 'float_map'
  | 'bool_map'
  | 'object'
  | 'bin';

export async function sendFimpMsg({
  address,
  service,
  cmd,
  val,
  val_t,
  props = {},
  timeoutMs = 10000,
}: {
  address: string;
  service: string;
  cmd: string;
  val: unknown;
  val_t: FimpValueType;
  props?: Record<string, any>;
  timeoutMs?: number;
}): Promise<FimpResponse> {
  const uid = uuidv4();
  const topic = `pt:j1/mt:cmd${address}`;
  const message = JSON.stringify({
    corid: null,
    ctime: new Date().toISOString(),
    props: props,
    resp_to: 'pt:j1/mt:rsp/rt:cloud/rn:remote-client/ad:smarthome-app',
    serv: service,
    src: 'smarthome-app',
    tags: [],
    type: cmd,
    uid: uid,
    val: val,
    val_t: val_t,
    ver: '1',
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      fimp?.removeListener('message', onResponse);
      const error = new Error(
        `Timeout waiting for FIMP response (uid: ${uid}, service: ${service}, cmd: ${cmd})`,
      );
      log.warn(error.message, error.stack);
      reject(error);
    }, timeoutMs);

    const onResponse = (topic: string, buffer: any) => {
      let bufferToString;
      try {
        bufferToString = buffer.toString();
      } catch (e) {
        log.warn('Invalid message received from hub MQTT broker', e);
        return;
      }

      let msg;
      try {
        msg = JSON.parse(bufferToString);
      } catch (e) {
        log.warn(
          `Invalid FIMP message received from hub MQTT broker\nMessage: ${bufferToString}`,
          e,
        );
        return;
      }

      if (msg.corid === uid) {
        if (msg.type === 'evt.error.report') {
          fimp?.removeListener('message', onResponse);

          const error = new Error(
            `Received FIMP response for message ${uid}: error (evt.error.report) (matched using uid)`,
          );
          log.warn(error.message, error.stack);
          reject(error);
          return;
        }

        log.debug(
          `Received FIMP response for message ${uid} (matched using uid).`,
        );

        clearTimeout(timeout);
        fimp?.removeListener('message', onResponse);
        resolve(msg);
        return;
      }

      if (msg.topic === `pt:j1/mt:evt${address}`) {
        if (msg.type === 'evt.error.report') {
          fimp?.removeListener('message', onResponse);

          const error = new Error(
            `Received FIMP response for message ${uid}: error (evt.error.report) (matched using topic)`,
          );
          log.warn(error.message, error.stack);
          reject(error);
          return;
        }

        log.debug(
          `Received FIMP response for message ${uid} (matched using topic).`,
        );

        clearTimeout(timeout);
        fimp?.removeListener('message', onResponse);
        resolve(msg);
        return;
      }

      const hasValidType = msg.type != null && msg.type.startsWith('evt.');
      const reqCmdParts = cmd.split('.');
      const resCmdParts = msg.type?.split('.') ?? [];
      const hasThreeParts =
        resCmdParts.length === 3 && reqCmdParts.length === 3;
      const middlePartMatches = resCmdParts[1] === reqCmdParts[1];
      const endsWithLastPart = cmd.endsWith(resCmdParts.at(-1)!);
      const reqEndsWithSetAndResEndsWithReport =
        reqCmdParts[2] === 'set' && resCmdParts[2] === 'report';
      const sameService = msg.serv === service;
      if (
        hasValidType &&
        hasThreeParts &&
        middlePartMatches &&
        (endsWithLastPart || reqEndsWithSetAndResEndsWithReport) &&
        sameService
      ) {
        log.debug(
          `Received FIMP response for message ${uid} (matched using event name).`,
        );

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
val: ${JSON.stringify(val)},
val_t: "${val_t}"${Object.entries(props).length > 0 ? `\nprops: ${JSON.stringify(props)}` : ''}${timeoutMs != 10000 ? `\ntimeoutMs: ${timeoutMs}` : ''}
`);

    fimp?.publish(topic, message, { qos: 1 });
  });
}
