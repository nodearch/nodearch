import { generate } from './lib/generate';
import {
  IComponentTs, IControllerTs, IDotEnv, IHookTs, IMainTs,
  IPackageJson, IReadmeMd,
  IServiceTs,
  IRepositoryTs,
  TLogger,
  IAppGeneratorOptions
} from './interfaces';
import path from 'node:path';
import { logger } from './lib/logger';
import { parseName } from './lib/util';

/**
 * Generator class responsible for creating project files from templates.
 * Handles the generation of configuration files, source files, and other project assets.
 */
export class Generator {

  private log: TLogger;

  constructor(log: TLogger = logger) {
    this.log = log;
  }

  /**
   * Generates the main.ts file for the application.
   * @param data - Configuration data for the main.ts template
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async mainTs(data: IMainTs, dirPath: string) {
    const generatedPath = await generate('main.ts.tpl', data, path.join(dirPath, 'src', 'main.ts'));

    this.log('main.ts generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the package.json file for the project.
   * @param data - Package configuration data
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async packageJson(data: IPackageJson, dirPath: string) {
    const generatedPath = await generate('package.json.tpl', data, path.join(dirPath, 'package.json'));

    this.log('package.json generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the README.md file for the project.
   * @param data - README content data
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async readmeMd(data: IReadmeMd, dirPath: string) {
    const generatedPath = await generate('README.md.tpl', data, path.join(dirPath, 'README.md'));

    this.log('README.md generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the .gitignore file for the project.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async gitignore(dirPath: string) {
    const generatedPath = await generate('gitignore.tpl', {}, path.join(dirPath, '.gitignore'));

    this.log('.gitignore generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the tsconfig.json file for TypeScript configuration.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async tsconfigJson(dirPath: string) {
    const generatedPath = await generate('tsconfig.json.tpl', {}, path.join(dirPath, 'tsconfig.json'));

    this.log('tsconfig.json generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the .env file for environment variables.
   * @param data - Environment variable configuration data
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async dotEnv(data: IDotEnv, dirPath: string) {
    const generatedPath = await generate('env.tpl', data, path.join(dirPath, '.env'));

    this.log('.env generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the .eslintrc.json file for ESLint configuration.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async eslintRcJson(dirPath: string) {
    const generatedPath = await generate('eslintrc.json.tpl', {}, path.join(dirPath, '.eslintrc.json'));

    this.log('.eslintrc.json generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the .eslintignore file for ESLint ignore configuration.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async eslintIgnore(dirPath: string) {
    const generatedPath = await generate('eslintignore.tpl', {}, path.join(dirPath, '.eslintignore'));

    this.log('.eslintignore generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the .prettierrc.json file for Prettier configuration.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async prettierRcJson(dirPath: string) {
    const generatedPath = await generate('prettierrc.json.tpl', {}, path.join(dirPath, '.prettierrc.json'));

    this.log('.prettierrc.json generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the VS Code settings.json file.
   * @param data - VS Code settings configuration data
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async vscodeSettingsJson(dirPath: string) {
    const generatedPath = await generate('vscode-settings.json.tpl', {}, path.join(dirPath, '.vscode/settings.json'));

    this.log('.vscode/settings.json generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the Dockerfile for containerization.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async dockerfile(dirPath: string) {
    const generatedPath = await generate('Dockerfile.tpl', {}, path.join(dirPath, 'Dockerfile'));

    this.log('Dockerfile generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the .dockerignore file for Docker build process.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async dockerignore(dirPath: string) {
    const generatedPath = await generate('dockerignore.tpl', {}, path.join(dirPath, '.dockerignore'));

    this.log('.dockerignore generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the GitHub CI/CD workflow YAML file.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async gitHubCiCdYml(dirPath: string) {
    const generatedPath = await generate('github-ci-cd.yml.tpl', {}, path.join(dirPath, '.github/workflows/ci-cd.yml'));

    this.log('.github/workflows/ci-cd.yml generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates the nodearch file.
   * @param dirPath - Target directory path where the file will be generated
   * @returns Promise with the path of the generated file
   */
  async nodearch(dirPath: string) {
    const generatedPath = await generate('nodearch.tpl', {}, path.join(dirPath, 'nodearch'));

    this.log('nodearch generated', generatedPath);

    return generatedPath;
  }

  /**
   * Generates a component TypeScript file.
   * @param data - Component configuration data
   * @param filePath - Target file path where the component will be generated
   * @returns Promise with the path of the generated file
   */
  async componentTs(data: IComponentTs, filePath: string) {
    const generatedPath = await generate('component.ts.tpl', data, filePath);

    this.log(`component generated`, generatedPath);

    return generatedPath;
  }

  /**
   * Generates a hook file.
   * @param name - The name of the hook
   * @param data - The hook configuration data
   * @param dirPath - The directory where the hook will be generated
   * @returns Promise with the path of the generated file
   */
  async hook(name: string, data: IHookTs, dirPath: string) {
    const generatedPath = await generate('hook.ts.tpl', data, path.join(dirPath, name + '.hook.ts'));

    this.log(`${name} hook generated`, generatedPath);

    return generatedPath;
  }

  /**
   * Generates a controller file.
   * @param name - The name of the controller
   * @param data - The controller configuration data
   * @param dirPath - The directory where the controller will be generated
   * @returns Promise with the path of the generated file
   */
  async controller(name: string, data: IControllerTs, dirPath: string) {
    const generatedPath = await generate('controller.ts.tpl', data, path.join(dirPath, name + '.controller.ts'));

    this.log(`${name} controller generated`, generatedPath);

    return generatedPath;
  }

  /**
   * Generates a service file.
   * @param name - The name of the service
   * @param data - The service configuration data
   * @param dirPath - The directory where the service will be generated
   * @returns Promise with the path of the generated file
   */
  async service(name: string, data: IServiceTs, dirPath: string) {
    const generatedPath = await generate('service.ts.tpl', data, path.join(dirPath, name + '.service.ts'));

    this.log(`${name} service generated`, generatedPath);

    return generatedPath;
  }

  /**
   * Generates a repository file.
   * @param name - The name of the repository
   * @param data - The repository configuration data
   * @param dirPath - The directory where the repository will be generated
   * @returns Promise with the path of the generated file
   */
  async repository(name: string, data: IRepositoryTs, dirPath: string) {
    const generatedPath = await generate('repository.ts.tpl', data, path.join(dirPath, name + '.repository.ts'));

    this.log(`${name} repository generated`, generatedPath);

    return generatedPath;
  }

  /**
   * This method generates the files for an app
   * @param data: IAppGeneratorOptions - the options for the app
   * @param appDir: string - the directory where the app will be generated
   */
  async app(data: IAppGeneratorOptions, appDir: string) {
    const appName = parseName(data.appName);

    await this.packageJson({
      packageName: appName.kebabCase,
      packageDescription: data.appDescription,
      extensions: data.extensions || {}
    }, appDir);
    await this.mainTs({
      className: appName.className,
      logPrefix: appName.className,
      title: appName.titleCase,
      extensions: data.extensions || {}
    }, appDir);
    await this.tsconfigJson(appDir);
    await this.nodearch(appDir);
    await this.readmeMd({
      title: appName.titleCase,
      description: data.appDescription
    }, appDir);
    await this.gitignore(appDir);
    await this.eslintIgnore(appDir);
    await this.eslintRcJson(appDir);
    await this.prettierRcJson(appDir);
    await this.vscodeSettingsJson(appDir);

  }

}