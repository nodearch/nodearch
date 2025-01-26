import { AppLoader, AppLoadMode } from '@nodearch/core/fs';

async function main() {
  const appLoader = new AppLoader({ cwd: new URL('..', import.meta.url), loadMode: AppLoadMode.JS, initMode: 'start' });
  await appLoader.load();
}
 
main().catch(e => {
  console.log(e);
  process.exit(1);
});
