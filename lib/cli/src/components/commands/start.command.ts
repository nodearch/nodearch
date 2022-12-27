import { Command, IAppInfo, ICommand } from '@nodearch/core';
import nodemon from 'nodemon';
import path from 'path';
import { AppService } from '../app/app.service';
import { CommandMode } from '../cli/enum';

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

  constructor(
    private readonly appService: AppService
  ) {}

  async handler(options: Record<string, any>) {
    if (options.watch) {
      this.startWatch(this.appService.appInfo!);
    }
    else {
      await this.appService.app!.start();
    }
  }

  private startWatch(appInfo: IAppInfo) {
    nodemon({
      watch: [appInfo.paths.dirs.app],
      ext: 'ts',
      script: path.join(appInfo.paths.dirs.app, 'start.ts'),
      legacyWatch: true
    });
  }

} 