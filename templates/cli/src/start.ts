import { AppLoadMode, AppLoader } from '@nodearch/core/fs';


async function main() {
  const appLoader = new AppLoader({ cwd: new URL('..', import.meta.url), loadMode: AppLoadMode.JS, initMode: 'start', args: [true] });
  await appLoader.load();
}

main().catch(e => {
  console.log(e);
  process.exit(1);
});