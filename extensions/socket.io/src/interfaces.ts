import { ComponentInfo } from '@nodearch/core/components';
import { ClassConstructor } from '@nodearch/core/utils';
import http from 'node:http';
import https from 'node:https';
import { ServerOptions } from 'socket.io';
import { SocketIOServerProvider } from './components/server.provider.js';
import * as IO from 'socket.io';
import { IExtensionProviderComponent } from '@nodearch/core';


export interface ISocketIOOptions {
  server?: IServerOptions;
  httpServer?: IExtensionProviderComponent<http.Server | https.Server>;  
  adapter?: ISocketAdapter;
  // Refer to https://socket.io/docs/v4/server-api/#new-Server-httpServer-options
  ioOptions?: Partial<ServerOptions>;
}

export type IServerOptions = {
  port: number;
  hostname?: string;
  https?: https.ServerOptions;
  http?: http.ServerOptions;
};

export interface IHttpServerProvider {
  get(): http.Server | https.Server;
}

export type IServerSettings = IServerOptions & {
  port: number;
  hostname: string;
};

export type ISocketAdapter = IAdapterConstructor | INativeAdapter;

export type IAdapterConstructor = ClassConstructor<IAdapter>;

export type IAdapter = {
  get(): INativeAdapter;
};

export type INativeAdapter = any; // Couldn't export the type from socket.io

export type ParentNspNameMatchFn = (name: string, auth: {
  [key: string]: any;
}, fn: (err: Error | null, success: boolean) => void) => void;

export type NamespaceName = string | RegExp | ParentNspNameMatchFn;


export interface INamespace {
  onConnection?(socket: IO.Socket): Promise<void>;
  middleware?(socket: IO.Socket): Promise<void>;
  onDisconnect?(socket: IO.Socket): Promise<void>;
  onAny?(event: string, ...args: any[]): Promise<void>;
}

export type INamespaceOptions = {
  name: NamespaceName;
};

export type ISubscriptionOptions = {
  eventName: string;
}; 

export interface INamespaceInfo {
  name: NamespaceName; 
  events: ISubscriptionInfo[];
  dependenciesKeys: {
    key: string;
    component: ClassConstructor;
  }[];
}

export interface IEventHandlerInput {
  id: string;
  paramIndex: number;
  data?: any;
}

export interface ISubscriptionInfo {
  eventName: string;
  eventMethod: string;
  eventComponent: ComponentInfo;
}

export type ISocketIOServerProvider = ClassConstructor<SocketIOServerProvider>;

export type INamespaceMap = Map<ComponentInfo, INamespaceInfo>;

export type IMiddlewareFunction = Parameters<IO.Server['use']>[0];