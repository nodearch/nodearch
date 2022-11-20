import { Hook, HookContext, IHook } from '@nodearch/core';
import { CliAnnotation } from '../../enums';
import { ICommand } from '../../interfaces';
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
    const builtinCommands = context.getAll<ICommand>(CliAnnotation.Command);
    await this.cliService.start(builtinCommands);
  }
}