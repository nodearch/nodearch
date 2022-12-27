import { AppContext, CoreAnnotation, Hook, ICommand, IHook } from '@nodearch/core';
import { AppService } from '../app/app.service';
import { CliService } from './cli.service';
import { CommandMode } from './enum';


@Hook()
export class CliHook implements IHook {
  
  constructor(
    private readonly appService: AppService,
    private readonly cliService: CliService,
    private readonly appContext: AppContext
  ) {}

  async onStart() {
    await this.appService.load();
    const builtinCommands = this.appContext.getAll<ICommand & { mode: CommandMode }>(CoreAnnotation.Command);

    let mode = this.appService.appInfo ? CommandMode.App : CommandMode.NoApp;
    
    await this.cliService.start(builtinCommands.filter(cmd => cmd.mode ? cmd.mode.includes(mode) : true));
  }
}