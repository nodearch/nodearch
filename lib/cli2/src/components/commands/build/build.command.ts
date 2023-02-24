import { Command, ICommand } from '@nodearch/command';
import { Logger } from '@nodearch/core';
import { fileURLToPath } from 'url';
import { LocalAppService } from '../../local-app.service.js';
import { TscService } from './tsc.service.js';

@Command()
export class BuildCommand implements ICommand {
  command = 'build';
  describe = 'Builds the application';
  aliases = 'b';

  constructor(
    private readonly tscService: TscService,
    private readonly localAppService: LocalAppService,
    private readonly logger: Logger
  ) {}

  async handler() {
    const localApp = await this.localAppService.getApp();
    
    // Safety check
    if (!localApp || !this.localAppService.appInfo) return;
    
    this.logger.info('Building the app using tsc...');

    await this.tscService.run([], fileURLToPath(this.localAppService.appInfo.paths.rootDir));
    
    this.logger.info('Build completed');
  }
}