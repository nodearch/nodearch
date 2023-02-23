/*
 * Scan and load the app
 * 1. Load package.json and tsconfig.json
 * 2. Construct the app info object
 * 3. Load the app
 */

import { pathToFileURL } from 'node:url';
import { IAppInfo, IPackageJSON, ITsConfig } from '../index.js';
import { FileLoader } from './file-loader.js';
import { UrlParser } from './url-parser.js';

export class AppLoader {

  private cwd: URL;
  private tsConfigName: string;
  private pkgUrl: URL;
  private tsConfigUrl: URL;
  private nodeModulesDir: URL;

  constructor(options?: { cwd?: URL, tsConfigName?: string, appFileName?: string }) {
    this.cwd = options?.cwd || pathToFileURL(process.cwd());
    this.tsConfigName = options?.tsConfigName || 'tsconfig.json';
    this.pkgUrl = UrlParser.join(this.cwd, 'package.json');
    this.tsConfigUrl = UrlParser.join(this.cwd, this.tsConfigName);
    this.nodeModulesDir = UrlParser.join(this.cwd, 'node_modules');
  }

  // load the APP and run the init function ???
  async load() {
    const pkg = await this.getPkg();
    const tsConfig = await this.getTsConfig();
  }

  private async getAppInfo() {
    const pkgInfo = await FileLoader.importJSON(this.pkgUrl) as IPackageJSON;
    const tsConfig = await FileLoader.importJSON(this.tsConfigUrl, true) as ITsConfig;

    const tsAppDir = UrlParser.join(this.cwd, tsConfig.compilerOptions.rootDir || 'src');
    const jsAppDir = UrlParser.join(this.cwd, tsConfig.compilerOptions.outDir || 'dist');
    
    const tsApp = UrlParser.join(tsAppDir, 'main.ts');
    const jsApp = UrlParser.join(tsAppDir, 'main.ts');


    const appInfo: IAppInfo = {
      name: pkgInfo.name,
      version: pkgInfo.version,
      paths: {
        rootDir: this.cwd,
        nodeModulesDir: this.nodeModulesDir,
        pkg: this.pkgUrl,
        tsConfig: this.tsConfigUrl,
        app: {
          ts: {
            dir: tsAppDir,
            file: tsApp
          },
          js: {
            dir: jsAppDir,
            file: jsApp
          }
        }
      }
    };

    return appInfo;
  }

  private async getPkg() {
    const pkgUrl = UrlParser.join(this.cwd, 'package.json');
    return await FileLoader.importJSON(pkgUrl) as IPackageJSON;
  }

  private async getTsConfig() {
    const tsConfigUrl = UrlParser.join(this.cwd, this.tsConfigName);
    return await FileLoader.importJSON(tsConfigUrl, true) as ITsConfig;
  }
}