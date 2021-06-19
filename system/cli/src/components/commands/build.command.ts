import { Logger, ICLI, CLI, ClassConstructor, App, AppStage, ComponentType, AppState } from '@nodearch/core';
import { AppInfoService } from '../app-info/app-info.service';
import { CmdRunner } from '../cli-exec';
import { IControllersTypes } from '../interfaces';
import fs from 'fs';
import util from 'util';
import path from 'path';


const writeFile = util.promisify(fs.writeFile);

@CLI()
export class BuildCommand implements ICLI {
  command: string;
  describe: string;
  aliases: string[];

  constructor(
    private readonly logger: Logger,
    private readonly cmdRunner: CmdRunner,
    private readonly appInfoService: AppInfoService
  ) {
    this.command = 'build';
    this.describe = 'Build NodeArch app';
    this.aliases = ['b'];
  }

  async handler () {
    try {
      await this.cmdRunner.runTsc();

      if (this.appInfoService.appInfo) {
        const rootDir = path.join(this.appInfoService.appInfo.rootDir, '..');
        const appControllersTypes: IControllersTypes = {};

        const NodearchApp: ClassConstructor<App> = (await import(this.appInfoService.appInfo.app))?.default;
        const appInstance = new NodearchApp();

        await appInstance.run(AppStage.Load, { state: AppState.TS, rootPath: rootDir });

        const controllers = appInstance.getControllers()?.map(c => c.name);

        if(controllers?.length) {
          const { options: { outDir = path.join(rootDir, 'dist') } } = appInstance.getProjectTSConfig();

          const distDir = path.join(outDir, 'components_types.json');

          for (const ctrl of controllers) {
            const methodTypes = await appInstance.getComponentTypes(ComponentType.Controller, ctrl);

            if (methodTypes) appControllersTypes[ctrl] = methodTypes;
          }

          await writeFile(distDir, JSON.stringify(appControllersTypes, null, 2));
        }
      }

      this.logger.info('Build success!');
    }
    catch (error) {
      this.logger.error('Build failed!', error);
    }
  }
}
