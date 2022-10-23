import { IClassLoaderOptions } from '../loader';
import { ComponentScope, IConfigOptions } from '../components';
import { App } from "./app";
import { ILogger, ILogOptions } from '../log';


export interface IAppConstructor {
  new(...args: any): App;
}

export interface IAppOptions {
  classLoader: IClassLoaderOptions;
  extensions?: App[];
  defaultScope?: ComponentScope;
  log?: ILogOptions;
  config?: IConfigOptions;
}

export interface IRunOptions {
  cli?: boolean;
  logger?: ILogger;
}