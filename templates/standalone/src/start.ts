
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';


async function main() {
  const appLoader = new AppLoader({ cwd: new URL('..', import.meta.url), appLoadMode: AppLoadMode.JS });

  const app = await appLoader.load();

  await app!.start();
}
 
main().catch(e => {
  console.log(e);
  process.exit(1);
});
