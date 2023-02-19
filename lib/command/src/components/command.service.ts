import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Service } from '@nodearch/core';
import { CommandParser } from './command-parser.js';
import { CommandConfig } from './command.config.js';
import { ICommand } from '../index.js';


@Service({ export: true })
export class CommandService {
  constructor(
    private readonly commandConfig: CommandConfig,
    private readonly commandParser: CommandParser
  ) {}

  async start(commands?: ICommand[]) {
    const args = yargs(hideBin(process.argv))
      .scriptName(this.commandConfig.name)
      .usage(this.commandConfig.usage)
      .demandCommand();

    this.commandParser.getCommands()
      .forEach(cmd => args.command(cmd));

    commands && commands
      .forEach(cmd => args.command(cmd));

    args.alias('h', 'help')
      .alias('v', 'version');

    args.argv;
  }
}