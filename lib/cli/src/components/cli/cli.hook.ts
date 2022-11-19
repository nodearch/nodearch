import { CoreAnnotation, Hook, HookContext, ICommand, IHook } from '@nodearch/core';
import { AppService } from '../app/app.service';
import { CliService } from './cli.service';

@Hook()
export class CliHook implements IHook {
  
  constructor(
    private readonly appService: AppService,
    private readonly cliService: CliService
  ) {}

  async onInit() {
    await this.appService.load();
  }

  async onStart(context: HookContext) {
    const builtinCommands = context.getAll<ICommand>(CoreAnnotation.Command);
    await this.cliService.start(builtinCommands);
  }
}