import yargs, { Arguments, CommandModule } from 'yargs';
import { Service, App, ClassConstructor, CLIQuestion, ICli, LogLevel, INpmDependency, RunMode, Logger } from '@nodearch/core';
import inquirer from 'inquirer';
import { AppInfoService } from './app-info/app-info.service';
import { NotifierService } from './notifier.service';
import { NpmService } from './npm';

@Service()
export class CLIService {

  constructor(
    private readonly appInfoService: AppInfoService, 
    private readonly notifierService: NotifierService,
    private readonly npmService: NpmService,
    private readonly logger: Logger
  ) {}

  async getLocalCliCommands(appPath: string) {
    const importedModule = await import(appPath)
    const ImportedApp: ClassConstructor<App> = importedModule?.default;
    
    if (ImportedApp) {
      const appInstance = new ImportedApp();
      // appInstance.setLogLevel(LogLevel.Error);
      await appInstance.run({ mode: RunMode.CLI, logOptions: { logLevel: LogLevel.Error } });

      return appInstance.componentManager.findCLICommands() || [];
    }
    else {
      throw new Error(`Cannot load Local App at ${appPath}`);
    }
  }

  getYargsCommands(cliCommands: ICli[]): CommandModule[] {
    return cliCommands.map(cliCMD => {
      const { handler, questions, npmDependencies, ...commandOptions } = cliCMD;
      const handlerFn = (args: Arguments) => this.handlerFactory(handler.bind(cliCMD), args, questions, npmDependencies);

      return {
        ...commandOptions,
        handler: handlerFn
      };
    });
  }

  async init(builtinCommands?: ICli[]) {

    let cliCommands: ICli[] = [];

    if (builtinCommands) {
      cliCommands = cliCommands.concat(builtinCommands);
    }

    if (this.appInfoService.appInfo) {
      const appPath = this.appInfoService.appInfo.app;

      const localCommands = await this.getLocalCliCommands(appPath);
      cliCommands = cliCommands.concat(localCommands);
    }

    const commands = yargs
      .scriptName('nodearch')
      .usage('Usage: nodearch <command> [options]')
      .demandCommand()

      .example('nodearch new', 'generates new app')
      .example('nodearch build', 'build existing app from the current directory')
      .example('nodearch start', 'starts existing app from the current directory')

      .alias('h', 'help')
      .alias('v', 'version')

      .option('notify', { 
        alias: ['y'], 
        boolean: true, 
        default: true,
        describe: 'turn desktop notifier on or off' 
      });

      if (cliCommands.length) {
        const yargsCommands = this.getYargsCommands(cliCommands);
        yargsCommands.forEach(yargsCmd => {
          commands.command(yargsCmd);
        });
      }

    return commands.help().argv;
  }

  private async handlerFactory(commandHandler: any, args?: Arguments, questions?: CLIQuestion<any>[], npmDependencies?: INpmDependency[]) {
    try {
      const validQuestions: CLIQuestion<any>[]= [];
      let answers;
  
      if (questions) {
        for (const question of questions) {
          if (!args || (question.name && !args[question.name])) validQuestions.push(question);
        }
      }
  
      if (validQuestions) answers = await inquirer.prompt(validQuestions);
  
      const data = { ...args, ...answers };
  
      this.notifierService.enabled = args?.notify ? true : false;
      
      if (npmDependencies && npmDependencies.length) {
        await this.npmService.resolveDependencies(npmDependencies.filter(dep => dep.when ? dep.when(data) : true));
      }
  
      await commandHandler(data);
    }
    catch(e: any) {
      this.logger.error(e.message);
      process.exit(1);
    }
  }

}
