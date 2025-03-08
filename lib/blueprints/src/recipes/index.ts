import path from 'node:path';
import { Generator } from '../generator';
import { ExtraComponentInfo, IStandardAppRecipeOptions } from '../interfaces';
import * as standardConfig from './standard.config';
import * as hookConfig from './hook.config';
import * as controllerConfig from './controller.config';
import { parseName } from '../lib/util';


/**
 * This class is responsible for generating the files for the different blueprints
 * @param generator: Generator - instance of the Generator class
 */
export class Recipes {

  private generator: Generator;

  constructor(generator: Generator = new Generator()) {
    this.generator = generator;
  }

  /**
   * This method generates the files for a standard app
   * @param data: IStandardAppRecipeOptions - the options for the standard app
   * @param appDir: string - the directory where the app will be generated
   */
  async standardApp(data: IStandardAppRecipeOptions, appDir: string) {

    const appName = parseName(data.appName);

    await this.generator.packageJson(standardConfig.getPackageJsonConfig(appName.kebabCase), appDir);
    await this.generator.mainTs(standardConfig.getMainConfig(appName.className), appDir);
    await this.generator.tsconfigJson(appDir);
    await this.generator.nodearch(appDir);
    await this.generator.readmeMd(standardConfig.getReadmeConfig(appName.titleCase, data.appDescription), appDir);
    await this.generator.gitignore(appDir);
    await this.generator.eslintIgnore(appDir);
    await this.generator.eslintRcJson(appDir);
    await this.generator.prettierRcJson(appDir);
  }

  /**
   * This method generates a hook file
   * @param name: string - the name of the hook
   * @param dirPath: string - the directory where the hook will be generated
   */
  async hook(name: string, dirPath: string) {
    const filePath = path.join(dirPath, name + '.hook.ts');

    this.generator.componentTs(
      hookConfig.getHookConfig(name),
      filePath
    );
  }

  async controller(name: string, dirPath: string, extraComponentInfo?: ExtraComponentInfo) {
    const filePath = path.join(dirPath, name + '.controller.ts');

    this.generator.componentTs(
      controllerConfig.getControllerConfig(name, extraComponentInfo),
      filePath
    );
  }
}