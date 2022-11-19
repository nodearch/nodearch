import { CommandMode, CommandQuestion, ICommand, INpmDependency, Logger, Service } from '@nodearch/core';
import inquirer from 'inquirer';
import yargs, { Arguments, CommandModule } from 'yargs';
import { AppService } from '../app/app.service';


@Service()
export class CliService { 

  private args: any;

  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
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

      // .example('new', 'Generates a new app')
      // .example('build', 'Build the app')
      // .example('start', 'Starts the app')

      .alias('h', 'help')
      .alias('v', 'version')

      .option('path', {
        alias: ['p'],
        string: true,
        describe: 'App file path'
      })

      // .option('notify', { 
      //   alias: ['y'], 
      //   boolean: true, 
      //   default: true,
      //   describe: 'turn desktop notifier on or off' 
      // });



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
  
      // this.notifierService.enabled = args?.notify ? true : false;
      
      // if (command.npmDependencies && command.npmDependencies.length) {
      //   await this.npmService.resolveDependencies(command.npmDependencies.filter(dep => dep.when ? dep.when(data) : true));
      // }
  
      await command.handler.bind(command)(data);
    }
    catch(e: any) {
      this.logger.error(e.message);
      process.exit(1);
    }
  }
}