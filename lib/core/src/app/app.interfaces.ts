import { ComponentScope } from '../components';
import { App } from "./app";
import { ILogger, ILogOptions } from '../log';


export interface IAppConstructor {
  new(...args: any): App;
}

export interface IAppOptions {
  path: string;
  scope?: ComponentScope;
  log?: ILogOptions;
  config?: Record<string, any>;
  extensions?: App[];
}

export interface IRunOptions {
  cli?: boolean;
  logger?: ILogger;
}