import { Command, ICommand } from '@nodearch/command';
import { TscService } from './tsc.service.js';

@Command()
export class BuildCommand implements ICommand {
  command = 'build';
  describe = 'Builds the application';
  aliases = 'b';

  constructor(
    private readonly tscService: TscService
  ) {}

  async handler() {
    // const localApp = await this.localAppService.getApp();
    // localApp?.info?.paths.root
    // await this.tscService.run([], process.cwd()// current dir?);
  }
}