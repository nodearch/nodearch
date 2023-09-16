import { IUseProvider } from '@nodearch/core/components';
import http from 'node:http';
import https from 'node:https';


export interface ISocketIOOptions {
  server: {
    httpServer: http.Server | https.Server;
  } | {
    port: number;
    hostname?: string;
    https?: https.ServerOptions;
    http?: http.ServerOptions;
  };
  adapters?: (IAdapter | INativeAdapter)[];
}

export type IAdapter = {
  getAdapter(getComponent:<T = any>(identifier: any)=> T): INativeAdapter;
};

export type INativeAdapter = (nsp: any) => any;

export type ParentNspNameMatchFn = (name: string, auth: {
  [key: string]: any;
}, fn: (err: Error | null, success: boolean) => void) => void;

export type NamespaceName = string | RegExp | ParentNspNameMatchFn;

export type INamespaceArgs = {};

export type INamespace = IUseProvider<INamespaceArgs, any>;