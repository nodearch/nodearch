import { IMainTs, IPackageJson, IReadmeMd } from '../interfaces';

export function getMainConfig(className: string): IMainTs {
  return {
    className,
    logPrefix: className,
    extensions: [],
    imports: [
      {
        moduleName: '@nodearch/core',
        imported: ['App']
      }
    ]
  };
}

export function getPackageJsonConfig(packageName: string): IPackageJson {
  return {
    packageName,
    scripts: [
      { name: 'start', command: 'node main.js' },
      { name: 'dev', command: 'ts-node main.ts' }
    ],
    devDependencies: [
      { name: 'ts-node', version: '1.0.0' },
      { name: 'typescript', version: '^1.0.0' }
    ],
    dependencies: [
      { name: 'express', version: '^1.0.0' }
    ]
  };
}

export function getReadmeConfig(title: string, description: string): IReadmeMd {
  return {
    title,
    description
  };
}