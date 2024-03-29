import { ConfigType } from './config.enums.js';

export abstract class TypeParser {
  static parse(value: string, defaultValue?: any, configType?: ConfigType) {
    let parsed;

    if (!configType && defaultValue !== undefined) {
      if (typeof defaultValue === 'number') configType = ConfigType.NUMBER;
      else if (defaultValue instanceof Date) configType = ConfigType.DATE;
      else if (typeof defaultValue === 'boolean') configType = ConfigType.BOOLEAN;
      else if (typeof defaultValue === 'object') configType = ConfigType.JSON;
    }

    switch (configType) {
      case ConfigType.JSON:
        parsed = JSON.parse(value);
        break;
      case ConfigType.NUMBER:
        parsed = parseInt(value);
        break;
      case ConfigType.DATE:
        parsed = new Date(value);
        break;
      case ConfigType.BOOLEAN:
        parsed = value === 'true' ? true : false;
        break;
      case ConfigType.STRING:
      default:
        parsed = value;
    }

    return parsed;
  }
}
