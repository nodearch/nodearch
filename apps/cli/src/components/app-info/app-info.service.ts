import { Service } from "@nodearch/core";
import { IAppInfo } from "./app-info.interfaces";
import path from 'path';
import fs from 'fs';


@Service()
export class AppInfoService {
  isApp: boolean;
  cwd: string;
  appInfo?: IAppInfo;

  constructor() {
    this.isApp = false;
    this.cwd = process.cwd();
  }

  async init() {
    const appPath = await this.getAppPath();

    if (appPath) {
      const resolvedAppPath = this.resolvePath(appPath);
      const rootDir = path.dirname(resolvedAppPath);
      const nodeModulesDir = path.join(this.cwd, 'node_modules'); 

      this.appInfo = {
        app: resolvedAppPath, 
        nodeModulesDir: nodeModulesDir,
        rootDir
      };
      this.isApp = true;
    }
  }

  private async getAppPath() {
    try {
      const defaultAppPath = path.join(process.cwd(), 'src', 'main.ts');
      const result = await fs.promises.lstat(defaultAppPath);
      return result.isFile() ? defaultAppPath : undefined;
    }
    catch(e) { /** we need to return the default path only if the file exists */ }
  }

  private resolvePath(strPath: string) {
    return (path.isAbsolute(strPath) ? 
      path.normalize(strPath) : path.resolve(strPath)).replace(/\\/g, '/');
  }
}