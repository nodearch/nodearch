import { IMainTs, IPackageJson, IReadmeMd } from '../interfaces';

export function getMainConfig(className: string): IMainTs {
  return {
    className,
    logPrefix: className,
    extensions: [
      {
        name: 'ExpressApp',
        options: [
          { key: 'port', value: 3000 }
        ]
      }
    ],
    imports: [
      {
        moduleName: '@nodearch/core',
        imported: ['App']
      },
      {
        moduleName: '@nodearch/express',
        imported: ['ExpressApp']
      }
    ]
  };
}

export function getPackageJsonConfig(): IPackageJson {
  return {
    packageName: 'my-app',
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