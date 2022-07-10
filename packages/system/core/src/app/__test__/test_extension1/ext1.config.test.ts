import { Config, ConfigManager,  } from "../../../components";

@Config()
export class Ext1Config {

  constructor(private config: ConfigManager) {}

  url: string = this.config.env({ defaults: { all: 'localhost:3000' }, external: 'SYSTEM_URL' })

}