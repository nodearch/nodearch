import { Command, ICommand } from '@nodearch/command';
import { LocalAppService } from '../../local-app.service.js';
import { TscService } from './tsc.service.js';

@Command()
export class BuildCommand implements ICommand {
  command = 'build';
  describe = 'Builds the application';
  aliases = 'b';

  constructor(
    private readonly tscService: TscService,
    private readonly localAppService: LocalAppService 
  ) {}

  async handler() {
    const localApp = await this.localAppService.getApp();
    localApp?.info?.paths.root
    await this.tscService.run([], process.cwd()// current dir?);
  }
}