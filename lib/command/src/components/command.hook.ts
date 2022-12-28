import { Hook, IHook } from '@nodearch/core';
import yargs, { Arguments, CommandModule } from 'yargs';
import { CommandConfig } from './command.config';


@Hook({ export: true })
export class CommandHook implements IHook {

  constructor(
    private readonly commandConfig: CommandConfig
  ) {}

  async onStart() {
    console.log('Hellllllllllllllllllllllllllllll');
    yargs
      .scriptName(this.commandConfig.name)
      .usage(this.commandConfig.usage)
      .demandCommand()

      .command('hi', 'dddd')

      .alias('h', 'help')
      .alias('v', 'version');

    yargs.argv;

  }
}