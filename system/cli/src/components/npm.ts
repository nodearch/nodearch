import { INpmDependency, Logger, NpmDependencyType, Service } from "@nodearch/core";
import { spawn } from 'child_process';
import { AppInfoService } from './app-info/app-info.service';
import fs from 'fs';


@Service()
export class NpmService {
  private readonly npmCli: string;

  constructor(private readonly logger: Logger, private readonly appInfoService: AppInfoService) {
    this.npmCli = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  }

  async install(location: string) {
    await this.runNpmCommand(['i'], location);
  }

  async installPackages(dependencies: INpmDependency[], location: string) {
    const depsToInstall: Record<string, string[]> = {
      dep: ['i', '--save'],
      dev: ['i', '--save-dev']
    };

    dependencies.forEach(dep => {
      const depInstallText = dep.version ? `${dep.name}@${dep.version}` : dep.name;
      dep.type = dep.type || NpmDependencyType.Dependency;
      depsToInstall[dep.type].push(depInstallText);
    });


    if (depsToInstall['dep'].length > 2) {      
      this.logger.info('Installing Npm Dependencies...');
      console.log('depsToInstall', depsToInstall);
      await this.runNpmCommand(depsToInstall['dep'], location);

    }

    if (depsToInstall['dev'].length > 2) {
      this.logger.info('Installing Npm DevDependencies...');

      await this.runNpmCommand(depsToInstall['dev'], location);
    }

  }

  async resolveDependencies(deps: INpmDependency[]) {
    // check if node_modules exist 
    if (this.appInfoService.appInfo) {
      let nodeModules: string[] = [];

      try {
        nodeModules = await fs.promises.readdir(this.appInfoService.appInfo.nodeModulesDir);
      }
      catch(e) { console.log(e) }
      finally {
        if (nodeModules.length) {
          const depsToInstall = deps.filter(dep => {
            return !nodeModules.includes(dep.name);
          });

          if (depsToInstall.length) {
            await this.installPackages(depsToInstall, this.appInfoService.cwd);
          }
        }
        else {
          await this.install(this.appInfoService.cwd);
          await this.resolveDependencies(deps);
        }
      }
    }
  } 

  private runNpmCommand(args: string[], location: string) {
    return new Promise((resolve, reject) => {

      const childProcess = spawn(this.npmCli, args, { stdio: 'ignore', cwd: location });
    
      childProcess.on('error', (error) => {
        reject(error);
      });
  
      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        }
      });

    });
  }
}