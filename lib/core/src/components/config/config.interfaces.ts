import { ConfigType } from './config.enums.js';

export interface IEnvConfig<T> {
  key?: string;
  external?: string;
  dataType?: ConfigType;
  required?: boolean;
  defaults?: {
    [envName: string]: T;
  };
}

export interface IConfigData {
  [key: string]: any;
}
