import { Config, ConfigManager } from "@nodearch/core";

@Config()
export class VaultConfig {
  hostname: string;

  constructor(config: ConfigManager) {
    this.hostname = config.env({
      defaults: { all: 'http://localhost:8200' },
      external: 'hostname'
    });  
  }
}