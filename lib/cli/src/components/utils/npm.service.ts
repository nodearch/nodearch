import { INpmDependency, Logger, NpmDependencyType, Service } from "@nodearch/core";
import { spawn } from 'child_process';
import { AppService } from '../app/app.service';
import fs from 'fs';


@Service()
export class NpmService {
  private readonly npmCli: string;

  constructor(
    private readonly logger: Logger, 
    private readonly appService: AppService
  ) {
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
    if (this.appService.appInfo) {
      let nodeModules: string[] = [];

      try {
        nodeModules = await fs.promises.readdir(this.appService.appInfo.paths.nodeModules);
      }
      catch(e) { console.log(e) }
      finally {
        if (nodeModules.length) {
          const depsToInstall = deps.filter(dep => {
            return !nodeModules.includes(dep.name);
          });

          if (depsToInstall.length) {
            await this.installPackages(depsToInstall, this.appService.appInfo.paths.root);
          }
        }
        else {
          await this.install(this.appService.appInfo.paths.root);
          await this.resolveDependencies(deps);
        }
      }
    }
  } 

  private runNpmCommand(args: string[], location: string): Promise<void> {
    return new Promise((resolve, reject) => {

      const childProcess = spawn(this.npmCli, args, { stdio: 'inherit', cwd: location });
    
      childProcess.on('message', (msg) => {
        console.log(msg);
      });

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