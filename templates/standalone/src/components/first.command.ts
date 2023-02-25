import { Command, CommandBuilder, CommandQuestion, ICommand } from '@nodearch/command';

@Command()
export class FirstCommand implements ICommand {
  command = 'first-command';
  describe = 'sssssssssssssssssss';

  handler(options: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

} 