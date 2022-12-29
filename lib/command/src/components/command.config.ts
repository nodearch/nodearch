import { Config, ConfigManager, ConfigType } from '@nodearch/core';

@Config()
export class CommandConfig {
  enable?: boolean;
  name: string;
  usage: string;

  constructor(config: ConfigManager) {
    this.enable = config.env({
      external: 'enable',
      dataType: ConfigType.BOOLEAN,
      required: false
    });

    this.name = config.env({
      external: 'name'
    });

    this.usage = config.env({
      external: 'usage'
    });
  }
}