import { ComponentScope } from '../components';
import { App } from "./app";
import { ILogger, ILogOptions } from '../log';
import { IClassLoaderOptions } from '../loader';


export interface IAppConstructor {
  new(...args: any): App;
}

export type IAppOptions = {
  components?: IClassLoaderOptions;
  scope?: ComponentScope;
  logging?: ILogOptions;
  config?: Record<string, any>;
  extensions?: App[];
};

export interface IRunOptions {
  cli?: boolean;
  logger?: ILogger;
}