import { OnErrorCallback, OnMessageCallback } from 'mqtt/*';
import { IMqttClient } from './interface';
import { Buffer } from 'buffer';
import { FimpResponse } from '../fimp/fimp';
import demo_data__state from './demo_data/state.json';
import demo_data__device from './demo_data/device.json';

export class DemoFimpMqttClient implements IMqttClient {
  private messageHandlers = new Set<OnMessageCallback>();
  private errorHandlers = new Set<OnErrorCallback>();
  private onceConnectHandlers: (() => void)[] = [];
  private onceErrorHandlers: OnErrorCallback[] = [];

  connect(
    _url: string,
    _options: {
      port: number;
      username: string;
      password: string;
      protocolVersion: 4;
    },
  ): void {
    setTimeout(() => {
      this.onceConnectHandlers.forEach((h) => h());
    }, 100);
  }

  subscribe(
    topicObject: string,
    opts?: { qos: 0 | 1 | 2 },
    callback?: (err: Error | null) => void,
  ): void;
  subscribe(_topic: string, _opts?: any, _callback?: any): void {}

  publish(
    topic: string,
    value: string,
    _options: {
      retain?: boolean;
      qos: 0 | 1 | 2;
    },
  ): void {
    const responseTopic = topic.replace(/^pt:j1\/mt:cmd/, 'pt:j1/mt:evt');

    setTimeout(() => {
      const msg = JSON.parse(value);

      const sendResponse = (response: FimpResponse) => {
        response.corid = response.corid ?? msg.uid;
        response.serv = response.serv ?? msg.serv;
        const buffer = Buffer.from(JSON.stringify(response));
        for (const handler of this.messageHandlers) {
          handler(responseTopic, buffer, { retain: false } as any);
        }
      };

      if (
        msg.serv == 'vinculum' &&
        msg.type == 'cmd.pd7.request' &&
        msg.val?.param?.components?.includes('house')
      ) {
        sendResponse({
          type: 'evt.pd7.response',
          val: { param: { house: { hubId: '000000004c38b232' } } },
        });
      } else if (
        msg.serv == 'vinculum' &&
        msg.type == 'cmd.pd7.request' &&
        msg.val?.param?.components?.includes('device')
      ) {
        sendResponse({
          type: 'evt.pd7.response',
          val: { param: { device: demo_data__device } },
        });
      } else if (
        msg.serv == 'vinculum' &&
        msg.type == 'cmd.pd7.request' &&
        msg.val?.param?.components?.includes('state')
      ) {
        sendResponse({
          type: 'evt.pd7.response',
          val: { param: { state: { devices: demo_data__state } } },
        });
      } else if (
        msg.type.split('.').length === 3 &&
        msg.type.split('.')[0] === 'cmd' &&
        msg.type.split('.')[2] === 'set'
      ) {
        sendResponse({
          type: `evt.${msg.type.split('.')[1]}.report`,
          val: msg.val,
          val_t: msg.val_t,
          props: msg.props,
        });
      } else {
        sendResponse({});
      }
    }, 300);
  }

  on(event: 'message', handler: OnMessageCallback): void;
  on(event: 'error', handler: OnErrorCallback): void;
  on(event: any, handler: any): void {
    if (event === 'message') {
      this.messageHandlers.add(handler);
    } else if (event === 'error') {
      this.errorHandlers.add(handler);
    }
  }

  off(event: 'message', handler: OnMessageCallback): void;
  off(event: 'error', handler: OnErrorCallback): void;
  off(event: any, handler: any): void {
    if (event === 'message') {
      this.messageHandlers.delete(handler);
    } else if (event === 'error') {
      this.errorHandlers.delete(handler);
    }
  }

  removeListener(event: 'message', handler: OnMessageCallback): void {
    this.off(event, handler);
  }

  once(event: 'connect', handler: () => void): void;
  once(event: 'error', handler: OnErrorCallback): void;
  once(event: 'disconnect', handler: () => void): void;
  once(event: any, handler: any): void {
    if (event === 'connect') {
      this.onceConnectHandlers.push(handler);
    } else if (event === 'error') {
      this.onceErrorHandlers.push(handler);
    } else if (event === 'disconnect') {
      // not possible in demo mode
    }
  }

  simulateError(message: string) {
    const err = new Error(message);
    for (const handler of this.errorHandlers) {
      handler(err);
    }
    this.onceErrorHandlers.forEach((h) => h(err));
    this.onceErrorHandlers = [];
  }
}
