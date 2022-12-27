import { CommandQuestion, ICommand, Logger, Service } from '@nodearch/core';
import inquirer from 'inquirer';
import yargs, { Arguments, CommandModule } from 'yargs';
import { AppService } from '../app/app.service';
import { NpmService } from '../utils/npm.service';


@Service()
export class CliService { 

  constructor(
    private readonly logger: Logger,
    private readonly appService: AppService,
    private readonly npmService: NpmService
  ) {}

  async start(builtinCommands: ICommand[]) {

    let commands = builtinCommands;

    // Add commands from loaded app
    if (this.appService.appInfo) {
      commands = [...builtinCommands, ...this.appService.getCommands()];
    }

    yargs
      .scriptName('nodearch')
      .usage('Usage: nodearch <command> [options]')
      .demandCommand()

      .alias('h', 'help')
      .alias('v', 'version');

    if (commands.length) {
      // TODO: refuse to register a command if we already registered another one with the same name
      const yargsCommands = this.getYargsCommands(commands);
      yargsCommands.forEach(yargsCmd => {
        yargs.command(yargsCmd);
      });
    }

    yargs.argv;
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
  
      if (command.npmDependencies && command.npmDependencies.length) {
        await this.npmService.resolveDependencies(command.npmDependencies.filter(dep => dep.when ? dep.when(data) : true));
      }
  
      await command.handler.bind(command)(data);
    }
    catch(e: any) {
      this.logger.error(e.message);
      process.exit(1);
    }
  }
}