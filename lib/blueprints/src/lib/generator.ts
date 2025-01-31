import { generate } from './generate.js';
import { IComponentTs, IDotEnv, IMainTs, IPackageJson, IReadmeMd, IVscodeSettingsJson } from './interfaces.js';

export async function mainTs(data: IMainTs, location: URL) {
  await generate('main.ts.tpl', data, location);
}

export async function packageJson(data: IPackageJson, location: URL) {
  await generate('package.json.tpl', data, location);
}

export async function componentTs(data: IComponentTs, location: URL) {
  await generate('component.ts.tpl', data, location);
}

export async function readmeMd(data: IReadmeMd, location: URL) {
  await generate('README.md.tpl', data, location);
}

export async function gitignore(location: URL) {
  await generate('gitignore.tpl', {}, location);
}

export async function tsconfigJson(location: URL) {
  await generate('tsconfig.json.tpl', {}, location);
}

export async function dotEnv(data: IDotEnv, location: URL) {
  await generate('env.tpl', data, location);
}

export async function eslintRcJson(location: URL) {
  await generate('eslintrc.json.tpl', {}, location);
}

export async function eslintIgnore(location: URL) {
  await generate('eslintignore.tpl', {}, location);
}

export async function prettierRcJson(location: URL) {
  await generate('prettierrc.json.tpl', {}, location);
}

export async function vscodeSettingsJson(data: IVscodeSettingsJson, location: URL) {
  await generate('vscode-settings.json.tpl', data, location);
}

export async function dockerfile(location: URL) {
  await generate('Dockerfile.tpl', {}, location);
}

export async function dockerignore(location: URL) {
  await generate('dockerignore.tpl', {}, location);
}

export async function ciCdYml(location: URL) {
  await generate('ci-cd.yml.tpl', {}, location);
}

export async function nodearch(location: URL) {
  await generate('nodearch.tpl', {}, location);
}