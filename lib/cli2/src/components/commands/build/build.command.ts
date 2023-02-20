import { Command, ICommand } from '@nodearch/command';

@Command()
export class BuildCommand implements ICommand {
  command = 'build';
  describe = 'Builds the application';
  aliases = 'b';

  async handler() {
    console.log('build');
  }
}