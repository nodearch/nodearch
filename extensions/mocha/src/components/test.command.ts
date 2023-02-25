import { toCamelCase } from '@nodearch/core/utils';
import { Command, CommandBuilder, ICommand } from '@nodearch/command';
import { MochaService } from './mocha.service.js';
import { testOptions } from './test.options.js';


@Command({ export: true })
export class TestCommand implements ICommand {
  command: string; 
  describe: string;
  aliases: string[];
  builder: CommandBuilder<any>;
  
  constructor(
    private readonly mochaService: MochaService
  ) {
    this.command = 'test';
    this.describe = 'Run automated test cases using mocha';
    this.aliases = ['t'];
    this.builder = testOptions;
  }

  async handler(options: Record<string, any>) {
    const mochaOptions = this.getCommandOptionsByPrefix(options, 'mocha-'); 
    const nycOptions = this.getCommandOptionsByPrefix(options, 'nyc-'); 

    const code = await this.mochaService.run({
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

  private getCommandOptionsByPrefix(options: Record<string, any>, prefix: string) {
    const commandOptions: any = {};

    Object
      .keys(options)
      .filter(x => x.startsWith(prefix))
      .forEach(op => {
        commandOptions[toCamelCase(op.replace(prefix, ''), '-')] = options[op];
      });

    return commandOptions;
  }
}
