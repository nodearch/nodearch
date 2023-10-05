import { Config, ConfigManager, ConfigType } from '@nodearch/core';

@Config()
export class CommandConfig {
  autoStart?: boolean;
  name: string;
  usage: string;

  constructor(config: ConfigManager) {
    this.autoStart = config.env({
      external: 'autoStart',
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