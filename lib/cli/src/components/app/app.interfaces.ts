import { App } from '@nodearch/core';

export interface IAppConfig {
  path: string;
}

export interface IAppInfo {
  paths: IAppPaths;
  app: App;
}

export interface IAppPaths {
  root: string;
  appDir: string;
  app: string;
  nodeModules: string;
}