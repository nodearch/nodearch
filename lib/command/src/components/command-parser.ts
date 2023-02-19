import { AppContext, Logger, Service } from '@nodearch/core';
import { Arguments, CommandModule } from 'yargs';
import { CommandAnnotation } from './annotation/enums.js';
import { CommandQuestion, ICommand } from './annotation/interfaces.js';
import inquirer from 'inquirer';


@Service()
export class CommandParser {
  constructor(
    private readonly appContext: AppContext,
    private readonly logger: Logger

  ) {}

  getCommands() {
    const commands = this.appContext.getAll<ICommand>(CommandAnnotation.Command);
    return this.getYargsCommands(commands);
  }

  private getYargsCommands(commands: ICommand[]): CommandModule[] {
    return commands.map(cmd => {
      const { handler, questions, ...commandOptions } = cmd;
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
  
      await command.handler.bind(command)(data);
    }
    catch(e: any) {
      this.logger.error(e.message);
      process.exit(1);
    }
  }
}