import { pathToFileURL } from 'node:url';
import { App, IAppInfo, IPackageJSON, ITsConfig } from '../index.js';
import { AppLoadMode } from './enums.js';
import { FileLoader } from './file-loader.js';
import { IAppLoaderOptions } from './interfaces.js';
import { UrlParser } from './url-parser.js';

export class AppLoader {

  private cwd: URL;
  private tsConfigName: string;
  private pkgUrl: URL;
  private tsConfigUrl: URL;
  private nodeModulesDir: URL;
  private appLoadMode: AppLoadMode;
  private appEntry: string;

  constructor(options?: IAppLoaderOptions) {
    this.cwd = options?.cwd || pathToFileURL(process.cwd());
    this.tsConfigName = options?.tsConfig || 'tsconfig.json';
    this.pkgUrl = UrlParser.join(this.cwd, 'package.json');
    this.tsConfigUrl = UrlParser.join(this.cwd, this.tsConfigName);
    this.nodeModulesDir = UrlParser.join(this.cwd, 'node_modules');
    this.appLoadMode = options?.appLoadMode || AppLoadMode.JS;
    this.appEntry = options?.appEntry || 'main';
  }

  async load() {
    const appInfo = await this.getAppInfo();
    const loadedModule = await FileLoader.importModule(appInfo.paths.app);
    const AppClass = this.getAppObject(loadedModule);
    
    if (AppClass) {
      const app = new AppClass(appInfo) as App;
      await app.init({
        mode: 'app',
        appInfo
      });
      return app;
    }
    else {
      throw new Error(`No App class found in module: ${appInfo.paths.app}`);
    }
  }

  private async getAppInfo() {
    const pkgInfo = await FileLoader.importJSON(this.pkgUrl) as IPackageJSON;
    const tsConfig = await FileLoader.importJSON(this.tsConfigUrl, true) as ITsConfig;
    
    let appDir: URL;

    if (this.appLoadMode === AppLoadMode.TS) {
      appDir = UrlParser.join(this.cwd, tsConfig.compilerOptions.rootDir || 'src');
    }
    else {
      appDir = UrlParser.join(this.cwd, tsConfig.compilerOptions.outDir || 'dist');
    }

    const app = UrlParser.join(appDir, this.appEntry + '.' + this.appLoadMode);

    const appInfo: IAppInfo = {
      name: pkgInfo.name,
      version: pkgInfo.version,
      paths: {
        rootDir: this.cwd,
        nodeModulesDir: this.nodeModulesDir,
        pkg: this.pkgUrl,
        tsConfig: this.tsConfigUrl,
        appDir,
        app
      }
    };

    return appInfo;
  }

  private getAppObject(moduleObj: Record<string, any>) {
    if (moduleObj.nodearch) return moduleObj;
  
    if (moduleObj.default?.nodearch) return moduleObj.default;
  
    const key = Object.keys(moduleObj).find(key => {
      if (moduleObj[key].nodearch) return true;
    });

    if (key) return moduleObj[key];
  }
}