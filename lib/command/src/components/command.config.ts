import { Config, ConfigManager, ConfigType } from '@nodearch/core';
import { CommandBuilder } from '../decorators/interfaces.js';


@Config()
export class CommandConfig {
  autoStart?: boolean;
  name: string;
  usage: string;
  options?: CommandBuilder<any>;

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

    this.options = config.env({
      external: 'options',
      required: false
    });
  }
}