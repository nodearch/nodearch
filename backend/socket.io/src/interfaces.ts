import io, { Socket } from 'socket.io';
import { ClassConstructor } from '@nodearch/core';
import { HandlerParamType } from './enums';

export interface ISocketIOOptions {
  ioServer: io.Server;
  sharedServer: boolean;
}

export interface IControllerMetadata {
  eventsMetadata: IEventSubscribeMetadata[];
  controller: ClassConstructor;
}

export interface IHandlerParamsMetadata {
  type: HandlerParamType;
  index: number;
}

export interface IEventSubscribeMetadata {
  eventName: string;
  method: string;
  params: IHandlerParamsMetadata[];
}

export interface IEventSubscribe extends IEventSubscribeMetadata {
  controller: ClassConstructor;
}

export type ParentNspNameMatchFn = (name: string, auth: {
  [key: string]: any;
}, fn: (err: Error | null, success: boolean) => void) => void;

export type NamespaceName = string | RegExp | ParentNspNameMatchFn;

/**
 * A reference to the Namespace and how it's being used on a given controller/method
 * These metadata are stored on the Controller class
 */
export interface IControllerNamespaceMetadata {
  classRef: ClassConstructor;
  method?: string;
};

export interface INamespaceInfo {
  classRef: ClassConstructor;
  name: NamespaceName;
  events: IEventSubscribe[];
}

export interface ISocketIOController {
  controller: ClassConstructor;
  events: IEventSubscribe[];
  // namespaces: INamespaceMetadata[];
}

export interface INamespaceEvents extends IEventSubscribe {
  controller: ClassConstructor;
}

export interface INamespaceControllerMetadata {
  classRef: ClassConstructor;
  instanceKey: string;
}

export interface INamespace {
  middleware?(socket: Socket): Promise<void>;
  onConnection?(socket: Socket): void;
  onDisconnect?(socket: Socket): void;
  [key: string]: any;
}

// export interface IEventOptions {
//   acknowledge: boolean;
// }