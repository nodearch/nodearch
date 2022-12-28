import { Config, ConfigManager } from '@nodearch/core';

@Config()
export class CommandConfig {
  name: string;
  usage: string;

  constructor(config: ConfigManager) {
    this.name = config.env({
      external: 'name'
    });

    this.usage = config.env({
      external: 'usage'
    });
  }
}