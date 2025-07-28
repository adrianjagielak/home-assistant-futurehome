import { IPublishPacket, OnErrorCallback, OnMessageCallback } from 'mqtt/*';

export interface IMqttClient {
  connect(
    url: string,
    options: {
      port: number;
      username: string;
      password: string;
      protocolVersion: 4;
    },
  ): void;

  subscribe(topic: string): void;
  subscribe(
    topicObject: string,
    opts?: { qos: 0 | 1 | 2 },
    callback?: (err: Error | null) => void,
  ): void;

  publish(
    topic: string,
    value: string,
    options: {
      retain?: boolean;
      qos: 0 | 1 | 2;
    },
  ): void;

  on(event: 'message', handler: OnMessageCallback): void;
  on(event: 'error', handler: OnErrorCallback): void;

  off(event: 'message', handler: OnMessageCallback): void;
  off(event: 'error', handler: OnErrorCallback): void;

  removeListener(
    event: 'message',
    handler: (topic: string, payload: Buffer, packet: IPublishPacket) => void,
  ): void;

  once(event: 'connect', handler: () => void): void;
  once(event: 'error', handler: OnErrorCallback): void;
  once(event: 'disconnect', handler: () => void): void;
}
