import { CoreAnnotation, Hook, HookContext, ICommand, IHook } from '@nodearch/core';
import { AppService } from './app/app.service';
import { CliService } from './command/cli.service';

@Hook()
export class CliHook implements IHook {
  
  constructor(
    private readonly appService: AppService,
    private readonly cliService: CliService
  ) {}

  async onInit(context: HookContext) {
    const builtinCommands = context.getAll<ICommand>(CoreAnnotation.Command);

    await this.appService.load();
    await this.cliService.start(builtinCommands);
  }
}