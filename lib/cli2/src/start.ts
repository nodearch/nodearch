#!/usr/bin/env ts-node

import { App } from '@nodearch/core';
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';


async function main() {
  let app: App | undefined; 

  // Try to load a local copy of the Cli
  try {
    const localCliPath = path.join(process.cwd(), 'node_modules', '@nodearch', 'cli');
    const appLoader = new AppLoader({ cwd: pathToFileURL(localCliPath), appLoadMode: AppLoadMode.JS });
    app = await appLoader.load();
  }
  catch(e: any) {}

  if (!app) {
    const appLoader = new AppLoader({ cwd: new URL('..', import.meta.url), appLoadMode: AppLoadMode.TS });
    app = await appLoader.load();
  }

  await app.start();
}
 
main().catch(e => {
  console.log(e);
  process.exit(1);
});
