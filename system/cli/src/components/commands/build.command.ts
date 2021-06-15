import { Logger, ICli, Cli } from '@nodearch/core';
import { CmdRunner } from '../cli-exec';

@Cli()
export class BuildCommand implements ICli {
  command: string;
  describe: string;
  aliases: string[];

  constructor(private readonly logger: Logger, private readonly cmdRunner: CmdRunner) {
    this.command = 'build';
    this.describe = 'Build NodeArch app';
    this.aliases = ['b'];
  }

  async handler () {
    try {
      await this.cmdRunner.runTsc();
      this.logger.info('Build success!');
    }
    catch (error) {
      this.logger.error('Build failed!', error);
    }
  }
}
