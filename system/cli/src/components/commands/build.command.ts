import { Logger, ICLI, CLI } from '@nodearch/core';
import { CmdRunner } from '../cli-exec';

@CLI()
export class BuildCommand implements ICLI {
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
