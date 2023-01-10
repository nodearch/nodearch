import { Hook, IHook } from '@nodearch/core';
import yargs, { Arguments, CommandModule } from 'yargs';
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

    yargs
      .scriptName(this.commandConfig.name)
      .usage(this.commandConfig.usage)
      .demandCommand();

    this.commandParser.getCommands()
      .forEach(cmd => yargs.command(cmd));

    yargs.alias('h', 'help')
      .alias('v', 'version');

    yargs.argv;

  }
}