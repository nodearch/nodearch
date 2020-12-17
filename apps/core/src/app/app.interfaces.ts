import { IClassLoaderOptions } from '../loader';
import { ComponentScope, IComponentsOptions } from '../components';
import {App} from "./app";
import {ClassConstructor} from "../utils";
import { ILoggingOptions } from '../logger';


export interface IAppConstructor {
  new(...args: any): App;
}

export interface IExtensionOptions {
  app: App;
  include: ClassConstructor[];
  config?: ClassConstructor;
}

export interface IAppOptions {
  classLoader?: IClassLoaderOptions;
  extensions?: IExtensionOptions[];
  defaultScope?: ComponentScope;
  externalConfig?: any;
  logging?: ILoggingOptions;
}