import { 
  Command, CommandBuilder, ICommand, utils
} from '@nodearch/core';
import { AppService } from '../../app/app.service';
import { CommandMode } from '../../cli/enum';
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
    private readonly mochaService: MochaService,
    private readonly appService: AppService
  ) {
    this.command = 'test';
    this.describe = 'Run automated test cases using mocha';
    this.aliases = ['t'];
    this.builder = testOptions;
    this.mode = [CommandMode.App];
    
  }

  async handler(options: Record<string, any>) {
    if (this.appService.appInfo) {
      const mochaOptions = this.getCommandOptionsByPrefix(options, 'mocha-'); 
      const nycOptions = this.getCommandOptionsByPrefix(options, 'nyc-'); 
      
      const code = await this.mochaService.run(this.appService.appInfo, {
        mochaOptions,
        nycOptions,
        generalOptions: {
          mode: options.mode,
          coverage: options.coverage,
          openCoverage: options.openCoverage
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
