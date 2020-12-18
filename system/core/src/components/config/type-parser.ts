import { ConfigType } from './config.enums';

export abstract class TypeParser {
  static parse(value: string, defaultValue?: any, configType?: ConfigType) {
    let parsed;

    if (!configType && defaultValue && typeof defaultValue === 'number') {
      configType = ConfigType.NUMBER;
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
      case ConfigType.STRING:
      default:
        parsed = value;
    }

    return parsed;
  }
}
