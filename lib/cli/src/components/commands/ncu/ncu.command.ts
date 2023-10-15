import { Command, ICommand, ICommandBuilder } from '@nodearch/command';
import { fileURLToPath } from 'node:url';
import ncu from 'npm-check-updates';
import { LocalAppService } from '../../local-app.service.js';
import { INcuOptions } from './ncu.interfaces.js';
import { Logger } from '@nodearch/core';
import { NpmService } from '../new/npm.service.js';


@Command()
export class NcuCommand implements ICommand<INcuOptions> {
  constructor(
    private localAppService: LocalAppService,
    private logger: Logger,
    private npmService: NpmService
  ) { }

  command = 'ncu';
  describe = 'Check for npm packages updates using npm-check-updates';
  builder: ICommandBuilder = {
    upgrade: {
      alias: 'u',
      type: 'boolean',
      describe: 'upgrade package.json dependencies',
      default: false
    }
  };

  async handler(options: INcuOptions) {

    if (!this.localAppService.isAppDir) return;

    const rootPath = fileURLToPath(this.localAppService.info!.paths.rootDir);
    const pkgPath = fileURLToPath(this.localAppService.info!.paths.pkg);

    this.logger.info('Checking for npm packages updates...');

    const upgraded = await ncu.run({
      packageFile: pkgPath,
      upgrade: options.upgrade,
      silent: true,
      jsonUpgraded: true,
      color: true
    });

    /** Pretty format and output */
    if (!upgraded) {
      this.logger.info('No npm packages updates found!');
      return;
    }

    const pkgs = Object.entries(upgraded).map(([Name, Version]) => ({ Name, Version }));

    if (!pkgs.length) {
      this.logger.info('All packages are up to date!');
      return;
    }

    console.table(pkgs, ['Name', 'Version']);

    if (!options.upgrade) {
      this.logger.info('To upgrade the npm packages run -> nodearch ncu -u');
      return;
    }

    this.logger.info('Running npm i');

    await this.npmService.install(rootPath);

    this.logger.info('Npm packages upgraded successfully!');
  }
}