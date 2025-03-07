import { generate } from './lib/generate';
import { 
  IComponentTs, IDotEnv, IMainTs, 
  IPackageJson, IReadmeMd, 
  IVscodeSettingsJson, 
  TLogger
} from './interfaces';
import path from 'node:path';
import { logger } from './lib/logger';

export class Generator {

  private log: TLogger; 

  constructor(log: TLogger = logger) {
    this.log = log;
  }

  async mainTs(data: IMainTs, dirPath: string) {
    const generatedPath = await generate('main.ts.tpl', data, path.join(dirPath, 'main.ts'));
    
    this.log('main.ts generated', generatedPath);
    
    return generatedPath;
  }

  async packageJson(data: IPackageJson, dirPath: string) {
    const generatedPath = await generate('package.json.tpl', data, path.join(dirPath, 'package.json'));
    
    this.log('package.json generated', generatedPath);
    
    return generatedPath;
  }

  async readmeMd(data: IReadmeMd, dirPath: string) {
    const generatedPath = await generate('README.md.tpl', data, path.join(dirPath, 'README.md'));
    
    this.log('README.md generated', generatedPath);
    
    return generatedPath;
  }

  async gitignore(dirPath: string) {
    const generatedPath = await generate('gitignore.tpl', {}, path.join(dirPath, '.gitignore'));
    
    this.log('.gitignore generated', generatedPath);
    
    return generatedPath;
  }

  async tsconfigJson(dirPath: string) {
    const generatedPath = await generate('tsconfig.json.tpl', {}, path.join(dirPath, 'tsconfig.json'));
    
    this.log('tsconfig.json generated', generatedPath);
    
    return generatedPath;
  }

  async dotEnv(data: IDotEnv, dirPath: string) {
    const generatedPath = await generate('env.tpl', data, path.join(dirPath, '.env'));
    
    this.log('.env generated', generatedPath);
    
    return generatedPath;
  }

  async eslintRcJson(dirPath: string) {
    const generatedPath = await generate('eslintrc.json.tpl', {}, path.join(dirPath, '.eslintrc.json'));
    
    this.log('.eslintrc.json generated', generatedPath);
    
    return generatedPath;
  }

  async eslintIgnore(dirPath: string) {
    const generatedPath = await generate('eslintignore.tpl', {}, path.join(dirPath, '.eslintignore'));
    
    this.log('.eslintignore generated', generatedPath);
    
    return generatedPath;
  }

  async prettierRcJson(dirPath: string) {
    const generatedPath = await generate('prettierrc.json.tpl', {}, path.join(dirPath, '.prettierrc.json'));
    
    this.log('.prettierrc.json generated', generatedPath);
    
    return generatedPath;
  }

  async vscodeSettingsJson(data: IVscodeSettingsJson, dirPath: string) {
    const generatedPath = await generate('vscode-settings.json.tpl', data, path.join(dirPath, '.vscode/settings.json'));
    
    this.log('.vscode/settings.json generated', generatedPath);
    
    return generatedPath;
  }

  async dockerfile(dirPath: string) {
    const generatedPath = await generate('Dockerfile.tpl', {}, path.join(dirPath, 'Dockerfile'));
    
    this.log('Dockerfile generated', generatedPath);
    
    return generatedPath;
  }

  async dockerignore(dirPath: string) {
    const generatedPath = await generate('dockerignore.tpl', {}, path.join(dirPath, '.dockerignore'));
    
    this.log('.dockerignore generated', generatedPath);
    
    return generatedPath;
  }

  async gitHubCiCdYml(dirPath: string) {
    const generatedPath = await generate('github-ci-cd.yml.tpl', {}, path.join(dirPath, '.github/workflows/ci-cd.yml'));
    
    this.log('.github/workflows/ci-cd.yml generated', generatedPath);
    
    return generatedPath;
  }

  async nodearch(dirPath: string) {
    const generatedPath = await generate('nodearch.tpl', {}, path.join(dirPath, 'nodearch'));
    
    this.log('nodearch generated', generatedPath);
    
    return generatedPath;
  }

  async componentTs(data: IComponentTs, filePath: string) {
    const generatedPath = await generate('component.ts.tpl', data, filePath);
    
    this.log(`component generated`, generatedPath);
    
    return generatedPath;
  }
}