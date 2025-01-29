import { generate } from './generate.js';
import { IMainTs, IPackageJson } from './interfaces.js';

export async function mainTs(data: IMainTs, location: any) {
  return await generate('main.ts.tpl', data, location);
}

export async function packageJson(data: IPackageJson, location: any) {
  return await generate('package.json.tpl', data, location);
}
