import { AppLoader, AppLoadMode } from '@nodearch/core/fs';

let rootDir = process.argv.find(x => x.startsWith('rootDir='));

if (rootDir) {
  rootDir = rootDir.replace('rootDir=', '');

  const app = await (new AppLoader({ appLoadMode: AppLoadMode.TS, cwd: new URL(rootDir) })).load();
  await app?.start();
}