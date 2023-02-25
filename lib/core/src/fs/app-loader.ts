import { pathToFileURL } from 'node:url';
import { App, IAppInfo, IPackageJSON, ITsConfig } from '../index.js';
import { AppLoadMode } from './enums.js';
import { FileLoader } from './file-loader.js';
import { IAppLoaderOptions } from './interfaces.js';
import { UrlParser } from './url-parser.js';

export class AppLoader {

  public isAppDir: boolean;
  public appInfo?: IAppInfo;
  public app?: App;

  private cwd: URL;
  private tsConfigName: string;
  private pkgUrl: URL;
  private tsConfigUrl: URL;
  private nodeModulesDir: URL;
  private appLoadMode: AppLoadMode;
  private appEntry: string;

  constructor(options?: IAppLoaderOptions) {
    this.isAppDir = false;
    this.cwd = options?.cwd || pathToFileURL(process.cwd());
    this.tsConfigName = options?.tsConfig || 'tsconfig.json';
    this.pkgUrl = UrlParser.join(this.cwd, 'package.json');
    this.tsConfigUrl = UrlParser.join(this.cwd, this.tsConfigName);
    this.nodeModulesDir = UrlParser.join(this.cwd, 'node_modules');
    this.appLoadMode = options?.appLoadMode || AppLoadMode.JS;
    this.appEntry = options?.appEntry || 'main';
  }

  async load() {
    // Load package.json from current directory
    const pkgInfo = await this.getPkg();

    if (!pkgInfo) return;

    // If the package.json file exists, it means we are in an app directory
    this.isAppDir = true;

    // Get the app info object
    this.appInfo = await this.getAppInfo(pkgInfo);

    const loadedModule = await FileLoader.importModule(this.appInfo.paths.app);

    const AppClass = this.getAppObject(loadedModule);
    
    if (AppClass) {
      this.app = new AppClass(this.appInfo) as App;
      await this.app.init({
        mode: 'app',
        appInfo: this.appInfo
      });
      return this.app;
    }
  }

  // Returns the package.json file if it exists and has a nodearch property
  private async getPkg() {
    const pkgInfo = await FileLoader.importJSON(this.pkgUrl) as IPackageJSON;
    return pkgInfo && pkgInfo.nodearch ? pkgInfo : undefined;
  }

  // Returns the app info object with the paths to the app files and directories
  private async getAppInfo(pkgInfo: IPackageJSON) {
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
      loadMode: this.appLoadMode,
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