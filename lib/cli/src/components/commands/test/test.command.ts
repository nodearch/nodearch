import { 
  Command, ICommand, ICommandHandlerOptions, Logger, TestMode 
} from '@nodearch/core';
import { MochaService } from './mocha.service';



@Command()
export class TestCommand implements ICommand {
  command: string;
  describe: string;
  aliases: string[];
  // builder: CommandBuilder<any>;
  // questions: CommandQuestion[];

  constructor(
    private readonly logger: Logger,
    private readonly mochaService: MochaService
  ) {
    this.command = 'test';
    this.describe = 'Run automated test cases using mocha';
    this.aliases = ['t'];
    // this.builder = {
    //   name: {
    //     alias: ['n'],
    //     describe: 'Your project name'
    //   },
    //   template: {
    //     alias: ['t'],
    //     describe: 'Template to download'
    //   }
    // }; 
  }

  async handler(options: ICommandHandlerOptions) {
    if (options.appInfo) {
      const code = await this.mochaService.run(options.appInfo);
      process.exit(code);
    }
  }
}
