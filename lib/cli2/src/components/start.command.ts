import { Command, CommandBuilder, CommandQuestion, ICommand, INpmDependency } from '@nodearch/command';

@Command()
export class StartCommand implements ICommand {
  command = 'start';
  describe = 'Starts the application';
  aliases = 's';
  builder = {
    watch: {
      alias: 'w',
      boolean: true,
      describe: 'Start in watch mode [nodemon]'
    }
  };

  handler(options: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

}