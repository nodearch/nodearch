import { AppContext, CoreAnnotation, Hook, ICommand, IHook } from '@nodearch/core';
import { AppService } from '../app/app.service';
import { CliService } from './cli.service';


@Hook()
export class CliHook implements IHook {
  
  constructor(
    private readonly appService: AppService,
    private readonly cliService: CliService,
    private readonly appContext: AppContext
  ) {}

  async onStart() {
    await this.appService.load();
    const builtinCommands = this.appContext.getAll<ICommand>(CoreAnnotation.Command);
    await this.cliService.start(builtinCommands);
  }
}