import { App, Service } from '@nodearch/core';
import { AppFinder } from '@nodearch/core/utils';
import { pathToFileURL } from 'url';


@Service()
export class LocalAppService {
  private localApp?: App;

  async getApp() {
    if (!this.localApp) {
      await this.load();
    }

    return this.localApp;
  }

  private async load() {
    const LocalApp = await AppFinder.loadApp(true);
    
    if (LocalApp) {
      this.localApp = new LocalApp();
      await this.localApp.init({ mode: 'app', cwd: pathToFileURL(process.cwd()), typescript: true });
    }
  }
}