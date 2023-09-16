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