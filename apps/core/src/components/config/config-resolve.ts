import { IEnvConfig } from './interfaces';
import { TypeParser } from './type-parser';

export abstract class ConfigResolve {
  static hasValue(x: any) {
    return x !== undefined;
  }

  static env<T>(envConfig: IEnvConfig<T>, currentEnv: string, externalConfig?: any): T {
    let defaultValue, envValue, externalValue;

    if (envConfig.defaults && Object.keys(envConfig.defaults).length) {
      /**
       * set default value ( to be used if no env var is available )
       * 1. get the one that matches the current env
       * 2. get the one with the key >> all <<
       */
      defaultValue = envConfig.defaults.hasOwnProperty(currentEnv) ?
        envConfig.defaults[currentEnv] : envConfig.defaults['all'];
    }

    if (envConfig.key) {
      /**
       * if we got an env key, then we should look it up in the process.env
       * and if we found something, we need to parse it to it's original type
       * because process.env values will always be strings no matter the original type was.
       * Parsing order is:
       * 1. use the dataType we got directly
       * 2. use typeof on the defaultValue ( because it was provided with the correct type )
       * 3. default to string ( process.env values type )
       */
      const value = <any> process.env[envConfig.key];

      if (ConfigResolve.hasValue(value)) {
        envValue = TypeParser.parse(value, defaultValue, envConfig.dataType);
      }
    }

    if (!ConfigResolve.hasValue(envValue) && (envConfig.external && externalConfig)) {
      externalValue = externalConfig[envConfig.external];
    }

    const value = ConfigResolve.hasValue(envValue) ? envValue :
      ConfigResolve.hasValue(externalValue) ?
      externalValue : defaultValue;

    if (ConfigResolve.hasValue(value) || !envConfig.required) {
      return value;
    }
    else {
      throw new Error(`Unable to resolve required config key!`);
    }
  }
}