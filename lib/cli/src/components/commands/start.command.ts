import { Command, CommandMode, IAppInfo, ICommand, ICommandHandlerOptions } from '@nodearch/core';
import nodemon from 'nodemon';
import path from 'path';

@Command()
export class StartCommand implements ICommand {

  command = 'start';
  describe = 'Start your App';
  aliases = ['s'];
  builder = {
    watch: {
      alias: 'w',
      boolean: true,
      describe: 'Start in watch mode [nodemon]'
    }
  };
  mode = [CommandMode.App];

  async handler({ data, appInfo }: ICommandHandlerOptions) {
    if (appInfo) {
      if (data.watch) {
        this.startWatch(appInfo);
      }
    }
  }

  private startWatch(appInfo: IAppInfo) {
    nodemon({
      watch: [appInfo.paths.appDir],
      ext: 'ts',
      script: path.join(appInfo.paths.appDir, 'start.ts'),
      legacyWatch: true
    });
  }

}