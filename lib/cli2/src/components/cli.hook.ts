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

    if (LocalApp) {
      const localApp = new LocalApp();
      await localApp.init({ mode: 'app', cwd: pathToFileURL(process.cwd()) });
      localAppCommands = localApp.getAll<ICommand>(CommandAnnotation.Command);
    }

    await this.commandService.start(localAppCommands);
  }
}