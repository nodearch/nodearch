import { AppContext, CoreAnnotation, ICommand, Service } from '@nodearch/core';
import { Arguments, CommandModule } from 'yargs';

@Service()
export class CommandParser {
  constructor(
    private readonly appContext: AppContext
  ) {}

  getCommands() {
    const commands = this.appContext.getAll<ICommand>(CoreAnnotation.Command);
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