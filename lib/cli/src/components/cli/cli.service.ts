import { Logger, Service } from '@nodearch/core';
import inquirer from 'inquirer';
import yargs, { Arguments, CommandModule } from 'yargs';
import { CommandMode } from '../../enums';
import { CommandQuestion, ICommand } from '../../interfaces';
import { AppService } from '../app/app.service';
import { NotifierService } from '../utils/notifier.service';
import { NpmService } from '../utils/npm.service';


@Service()
export class CliService { 

  constructor(
    private readonly logger: Logger,
    private readonly appService: AppService,
    private readonly notifierService: NotifierService,
    private readonly npmService: NpmService
  ) {}

  async start(builtinCommands: ICommand[]) {

    let commands = builtinCommands;

    let mode = CommandMode.NoApp;

    // Add commands from loaded app
    if (this.appService.appInfo) {
      mode = CommandMode.App;
      commands = [...builtinCommands, ...this.appService.getCommands()];
    }

    // filter commands based on current mode
    commands = commands.filter(cmd => cmd.mode ? cmd.mode.includes(mode) : true);

    yargs
      .scriptName('nodearch')
      .usage('Usage: nodearch <command> [options]')
      .demandCommand()

      .alias('h', 'help')
      .alias('v', 'version')

      .option('notify', { 
        alias: ['y'], 
        boolean: true, 
        default: true,
        describe: 'Enable/disable desktop notifications' 
      });

    if (commands.length) {
      const yargsCommands = this.getYargsCommands(commands);
      yargsCommands.forEach(yargsCmd => {
        yargs.command(yargsCmd);
      });
    }

    yargs.pkgConf('nodearch').argv;
  }

  getYargsCommands(commands: ICommand[]): CommandModule[] {
    return commands.map(cmd => {
      const { handler, questions, npmDependencies, ...commandOptions } = cmd;
      const handlerFn = (args: Arguments) => this.handlerFactory(cmd, args);

      return {
        ...commandOptions,
        handler: handlerFn
      };
    });
  }

  private async handlerFactory(command: ICommand, args: Arguments) {
    try {
      const validQuestions: CommandQuestion<any>[]= [];
      let answers;
  
      if (command.questions) {
        for (const question of command.questions) {
          if (!args || (question.name && !args[question.name])) validQuestions.push(question);
        }
      }
  
      if (validQuestions) answers = await inquirer.prompt(validQuestions);
  
      const data = { ...args, ...answers };
  
      this.notifierService.enabled = !!args?.notify;
      
      if (command.npmDependencies && command.npmDependencies.length) {
        await this.npmService.resolveDependencies(command.npmDependencies.filter(dep => dep.when ? dep.when(data) : true));
      }
  
      await command.handler.bind(command)({ data, notifierService: this.notifierService, appInfo: this.appService.appInfo });
    }
    catch(e: any) {
      this.logger.error(e.message);
      process.exit(1);
    }
  }
}