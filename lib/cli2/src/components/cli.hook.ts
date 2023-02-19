import { CommandAnnotation, ICommand, CommandService } from '@nodearch/command';
import { Hook, IHook } from '@nodearch/core';
import { AppFinder } from '@nodearch/core/utils';
import { pathToFileURL } from 'url';

@Hook()
export class CliHook implements IHook {

  constructor(
    private readonly commandService: CommandService
  ) {}

  async onStart() {
    const LocalApp = await AppFinder.loadApp(true);
    let localAppCommands: ICommand[] = [];
    const excludedCommands: string[] = [];

    if (LocalApp) {
      excludedCommands.push('new');
      const localApp = new LocalApp();
      await localApp.init({ mode: 'app', cwd: pathToFileURL(process.cwd()) });
      localAppCommands = localApp.getAll<ICommand>(CommandAnnotation.Command);
    }
    else {
      excludedCommands.push('start');
      excludedCommands.push('build');
    }

    await this.commandService.start({ commands: localAppCommands, exclude: excludedCommands });
  }
}