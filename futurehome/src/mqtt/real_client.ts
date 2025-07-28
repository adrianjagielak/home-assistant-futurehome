import { connect, MqttClient, OnErrorCallback, OnMessageCallback } from 'mqtt';
import { IMqttClient } from './interface';

export class RealMqttClient implements IMqttClient {
  private client: MqttClient;

  constructor() {
    this.client = {} as MqttClient; // gets initialized in connect()
  }

  connect(
    url: string,
    options: {
      port: number;
      username: string;
      password: string;
      protocolVersion: 4;
    },
  ): void {
    this.client = connect(url, options);
  }

  subscribe(
    topicObject: string,
    opts?: { qos: 0 | 1 | 2 },
    callback?: (err: Error | null) => void,
  ): void;
  subscribe(topic: string, opts?: any, callback?: any): void {
    if (opts) {
      this.client.subscribe(topic, opts, callback);
    } else {
      this.client.subscribe(topic);
    }
  }

  publish(
    topic: string,
    value: string,
    options: {
      retain?: boolean;
      qos: 0 | 1 | 2;
    },
  ): void {
    this.client.publish(topic, value, options);
  }

  on(event: 'message', handler: OnMessageCallback): void;
  on(event: 'error', handler: OnErrorCallback): void;
  on(event: any, handler: any): void {
    this.client.on(event, handler);
  }

  off(event: 'message', handler: OnMessageCallback): void;
  off(event: 'error', handler: OnErrorCallback): void;
  off(event: any, handler: any): void {
    this.client.off(event, handler);
  }

  removeListener(event: 'message', handler: OnMessageCallback): void {
    this.client.removeListener(event, handler);
  }

  once(event: 'connect', handler: () => void): void;
  once(event: 'error', handler: OnErrorCallback): void;
  once(event: 'disconnect', handler: () => void): void;
  once(event: any, handler: any): void {
    this.client.once(event, handler);
  }
}
