import io, {} from 'socket.io';
import { ClassConstructor } from '../../../system/core/dist';
import { EventHandlerParamType } from './enums';

export interface ISocketIOOptions {
  ioServer: io.Server;
}

export interface IEventHandlerParamsMetadata {
  type: EventHandlerParamType;
  index: number;
}

export interface IEventSubscribeMetadata {
  eventName: string;
  method: string;
  params: IEventHandlerParamsMetadata[];
}

export interface IEventSubscribe extends IEventSubscribeMetadata {
  controller: ClassConstructor;
}

/**
 * A reference to the Namespace and how it's being used on a given controller/method
 * These metadata are stored on the Controller class
 */
export interface IControllerNamespaceMetadata {
  name: string;
  classRef: ClassConstructor;
  method?: string;
};

/**
 * Information about the Namespace itself regardless of where it's being used.
 * These are the metadata stored on the Namespace class itself.
 */
export interface INamespaceMetadata {
  name: string;
}

export interface INamespaceInfo {
  classRef: ClassConstructor;
  metadata: INamespaceMetadata;
  events: IEventSubscribe[];
}

export interface ISocketIOController {
  controller: ClassConstructor;
  events: IEventSubscribe[];
  // namespaces: INamespaceMetadata[];
}

export type ParentNspNameMatchFn = (name: string, auth: {
  [key: string]: any;
}, fn: (err: Error | null, success: boolean) => void) => void;

export interface INamespaceEvents extends IEventSubscribe {
  controller: ClassConstructor;
}

export interface INamespaceControllerMetadata {
  classRef: ClassConstructor;
  instanceKey: string;
}
