import { IClassLoaderOptions } from '../fs/interfaces.js';
import { ILogOptions } from '../log/interfaces.js';
import { AppContext } from './app-context.js';
import { App } from './app.js';
import { AppLoadMode } from '../fs/enums.js';
import { ComponentScope } from '../components/enums.js';


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
  appSettings: IAppSettings;
} | {
  mode: 'ext';
  logs: ILogOptions;
  appContext: AppContext;
};

export interface IAppSettings {
  name: string;
  version: string;
  paths: IAppPaths;
  loadMode: AppLoadMode;
}

export interface IAppPaths {
  rootDir: URL;
  nodeModulesDir: URL;
  pkg: URL;
  tsConfig: URL;
  appDir: URL;
  app: URL;
}

export interface IPackageJSON {
  name: string;
  version: string;
  nodearch: {};
  [key: string]: any;
}

export interface ITsConfig {
  compilerOptions: {
    [key: string]: any;
    rootDir: string;
    outDir: string;
  };
  [key: string]: any;
}