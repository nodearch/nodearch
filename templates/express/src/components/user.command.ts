import { Command, ICommand } from '@nodearch/command';

@Command()
export class UserCommand implements ICommand {
  command = 'user';
  describe = 'User command description';

  async handler(args: any) {
    console.log('User command handler');
  }
}