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

export enum RunMode {
  CLI,
  APP,
  EXT,
  TEST
}

export enum AppLifecycle {
  LOAD = 'load',
  INIT = 'init',
  START = 'start'
}

export interface IRunApp {
  mode: RunMode.APP;
}

export interface IRunCli {
  mode: RunMode.CLI;
  logOptions?: ILogOptions;
}

export interface IRunExt {
  mode: RunMode.EXT;
  logger: ILogger;
  enableCli: boolean;
}

export interface IRunTest {
  mode: RunMode.TEST;
  testRunner: ITestRunner;
  testMode: TestMode[];
}

export type IRunOptions = IRunApp | IRunCli | IRunExt | IRunTest;