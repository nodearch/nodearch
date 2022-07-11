import { IClassLoaderOptions } from '../loader';
import { ComponentScope, ITestRunner, IConfigOptions, TestMode } from '../component';
import { App } from "./app";
import { ILogger, ILogOptions } from '../log';


export interface IAppConstructor {
  new(...args: any): App;
}

export interface IAppInfo {
  name: string;
  version: string;
}

export interface IAppOptions {
  appInfo: IAppInfo;
  classLoader: IClassLoaderOptions;
  extensions?: App[];
  defaultScope?: ComponentScope;
  log?: ILogOptions;
  config?: IConfigOptions;
}

export enum AppLifecycle {
  LOAD = 'load',
  INIT = 'init',
  START = 'start'
}

export interface IRunOptions {
  exclude?: string[];
  extExclude?: string[];
  logger?: ILogger;
}