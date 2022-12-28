import { Command, IAppInfo, ICommand } from '@nodearch/core';
import nodemon from 'nodemon';
import path from 'path';
import { AppService } from '../../app/app.service';
import { CommandMode } from '../../cli/enum';
import { ExecService } from '../../utils/exec.service';
import { fork } from 'child_process';

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
    private readonly appService: AppService,
    private readonly execService: ExecService
  ) {}

  async handler(options: Record<string, any>) {
    if (options.watch) {
      this.startWatch(this.appService.appInfo!);
    }
    else {

      fork(
        path.join(__dirname, '..', '..', '..', '..', 'child-processes', 'start-app'), 
        // [
        //   this.appService.appInfo!.paths.files.app,
        //   this.appService.appInfo!.paths.files.package
        // ], 
        { 
          cwd: this.appService.appInfo?.paths.dirs.app
        }
      );

      // await this.appService.app!.start();
      // await this.execService.tsNode(`
      // console.log('XX', '${this.appService.appInfo?.paths.files.app.replace(/\\/g, "\\\\")}')
      //   async function main() { 
      //     const CliTemplate = (await import('${this.appService.appInfo?.paths.files.app.replace(/\\/g, "\\\\")}'))?.default; 
      //     const app = new CliTemplate(); 
      //     await app.init({ 
      //       mode: 'app', 
      //       appInfo: "${this.appService.appInfo?.paths.files.package.replace(/\\/g, "\\\\")}" 
      //     }); 
          
      //     await app.start(); 
      //   } 
        
      //   main().catch(console.log);
      // `);
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