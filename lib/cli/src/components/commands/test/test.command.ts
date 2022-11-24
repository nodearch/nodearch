import { 
  Command, CommandBuilder, CommandMode, ICommand, ICommandHandlerOptions, utils
} from '@nodearch/core';
import { MochaService } from './mocha.service';
import { testOptions } from './test.options';


@Command()
export class TestCommand implements ICommand {
  command: string; 
  describe: string;
  aliases: string[];
  builder: CommandBuilder<any>;
  mode: CommandMode[];
  
  constructor(
    private readonly mochaService: MochaService
  ) {
    this.command = 'test';
    this.describe = 'Run automated test cases using mocha';
    this.aliases = ['t'];
    this.builder = testOptions;
    this.mode = [CommandMode.App];
    
  }

  async handler(options: ICommandHandlerOptions<Record<string, any>>) {
    if (options.appInfo) {
      const mochaOptions = this.getCommandOptionsByPrefix(options.data, 'mocha-'); 
      const nycOptions = this.getCommandOptionsByPrefix(options.data, 'nyc-'); 
      
      const code = await this.mochaService.run(options.appInfo, {
        mochaOptions,
        nycOptions,
        generalOptions: {
          mode: options.data.mode,
          coverage: options.data.coverage,
          openCoverage: options.data.openCoverage
        }
      });

      process.exit(code);
    }
  }

  private getCommandOptionsByPrefix(options: Record<string, any>, prefix: string) {
    const commandOptions: any = {};

    Object
      .keys(options)
      .filter(x => x.startsWith(prefix))
      .forEach(op => {
        commandOptions[utils.toCamelCase(op.replace(prefix, ''), '-')] = options[op];
      });

    return commandOptions;
  }
}
