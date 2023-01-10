import { ConfigResolve } from './config-resolve.js';
import { IEnvConfig } from './config.interfaces.js';


/**
 * Configurations Order
 * 1. Environment
 * 2. External
 * 3. Defaults
 */
export class ConfigManager {
  private externalConfig?: any;
  private static readonly currentEnv = process.env.NODE_ENV || 'development';

  constructor(externalConfig?: Record<string, any>) {
    // TODO: Accept class instead of object and merge it with local config data without specifying an external key Or just leave it, because it will be mostly syntax only?
    this.externalConfig = externalConfig;

    if (this.externalConfig && (typeof this.externalConfig !== 'object' || !Object.keys(this.externalConfig).length)) {
      throw new Error(`External Configurations can only be non-empty object - option: components.externalConfig`);
    }
  }

  env<T>(envConfig: IEnvConfig<T>): T {
    return ConfigResolve.env<T>(envConfig, ConfigManager.currentEnv, this.externalConfig);
  }

  static env<T>(envConfig: Omit<IEnvConfig<T>, 'external'>): T {
    return ConfigResolve.env<T>(envConfig, ConfigManager.currentEnv);
  }
}