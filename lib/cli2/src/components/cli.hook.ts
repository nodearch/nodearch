import { CommandAnnotation, ICommand, CommandService } from '@nodearch/command';
import { Hook, IHook } from '@nodearch/core';
import { LocalAppService } from './local-app.service.js';

@Hook()
export class CliHook implements IHook {

  constructor(
    private readonly commandService: CommandService,
    private readonly localAppService: LocalAppService
  ) {}

  async onStart() {
    const localApp = await this.localAppService.getApp();
    let localAppCommands: ICommand[] = [];
    const excludedCommands: string[] = [];
    
    if (localApp) {
      excludedCommands.push('new');
      localAppCommands = localApp.getAll<ICommand>(CommandAnnotation.Command);
    }
    else {
      excludedCommands.push('start');
      excludedCommands.push('build');
    }

    await this.commandService.start({ commands: localAppCommands, exclude: excludedCommands });
  }
}