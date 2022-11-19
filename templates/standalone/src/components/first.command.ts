import { Command, CommandBuilder, CommandHandler, ICommand } from '@nodearch/core';


type One = {
  a: string;
  b: number;
}

@Command()
export class FirstCommand implements ICommand<One> {

  command = 'test-cmd';
  describe = 'ssssssssssssssssssss';

  // builder = {};

  async handler(data: One) {
    console.log('In handler', data);
  }

}