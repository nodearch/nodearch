import { Hook, IHook } from '@nodearch/core';
import { CommandConfig } from './command.config.js';
import { CommandService } from './command.service.js';


@Hook({ export: true })
export class CommandHook implements IHook {

  constructor(
    private readonly commandConfig: CommandConfig,
    private readonly commandService: CommandService
  ) {}

  async onStart() {
    if (this.commandConfig.autoStart) {
      await this.commandService.start();
    }
  }
}