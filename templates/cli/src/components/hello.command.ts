import { Command, ICommand, Logger } from '@nodearch/core';

@Command({ export: true })
export class HelloCommand implements ICommand {

  command = 'hi';
  describe = 'A Hi Command';
  aliases = 'i';

  constructor(
    private readonly logger: Logger
  ) {}

  async handler(options: any) {
    this.logger.info('Hi...!');
  }

}