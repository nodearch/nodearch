import { Hook, HookContext, IHook } from '@nodearch/core';
import { AppInfoService } from './app-info/app-info.service';
import { CLIService } from './cli.service';

@Hook()
export class CLIHook implements IHook {
  constructor(private readonly cliService: CLIService, private readonly appInfoService: AppInfoService) {}

  async onInit(context: HookContext) {
    await this.appInfoService.init();
    const builtinCommands = context.findCLICommands();
    await this.cliService.init(builtinCommands);
  }
}