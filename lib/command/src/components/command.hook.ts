import { Hook, IHook } from '@nodearch/core';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CommandParser } from './command-parser.js';
import { CommandConfig } from './command.config.js';


@Hook({ export: true })
export class CommandHook implements IHook {

  constructor(
    private readonly commandConfig: CommandConfig,
    private readonly commandParser: CommandParser
  ) {}

  async onStart() {
    if (!this.commandConfig.enable) return;

    const args = yargs(hideBin(process.argv))
      .scriptName(this.commandConfig.name)
      .usage(this.commandConfig.usage)
      .demandCommand();

    this.commandParser.getCommands()
      .forEach(cmd => args.command(cmd));

    args.alias('h', 'help')
      .alias('v', 'version');

    args.argv;
  }
}