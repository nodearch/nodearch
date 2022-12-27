import { ComponentScope } from '../components';
import { App } from "./app";
import { ILogger, ILogOptions } from '../log';
import { IClassLoaderOptions } from '../loader';
import { AppContext } from './app-context';


export interface IAppConstructor {
  new(...args: any): App;
}

export type IAppOptions = {
  components: IClassLoaderOptions & { 
    scope?: ComponentScope; 
  };
  logs?: ILogOptions;
  config?: Record<string, any>;
  extensions?: App[];
};

export type IInitOptions = {
  mode: 'app';
  appInfo: IAppInfo | string;
} | {
  mode: 'ext';
  logger: ILogger;
  appContext: AppContext;
};

export interface IAppInfo {
  name: string;
  version: string;
  paths: IAppPaths;
}

export interface IAppPaths {
  dirs: {
    root: string;
    app: string;
    nodeModules: string;
  };
  files: {
    app: string;
    package: string;
  };
}

export interface IPackageJSON {
  name: string;
  version: string;
  nodearch: {
    paths: {
      root: string;
      app: string;
    };
  };
}