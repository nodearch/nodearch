#!/usr/bin/env ts-node

import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';


async function main() {
  let loaded = false;

  // Try to load a local copy of the Cli
  try {
    const localCliPath = path.join(process.cwd(), 'node_modules', '@nodearch', 'cli');
    const appLoader = new AppLoader({ cwd: pathToFileURL(localCliPath), loadMode: AppLoadMode.JS, initMode: 'start' });
    loaded = !!(await appLoader.load());
  }
  catch(e: any) {}

  if (!loaded) {
    const appLoader = new AppLoader({ cwd: new URL('..', import.meta.url), loadMode: AppLoadMode.JS, initMode: 'start' });
    await appLoader.load();
  }
}
 
main().catch(e => {
  console.log(e);
  process.exit(1);
});
