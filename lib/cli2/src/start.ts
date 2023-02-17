#!/usr/bin/env node

import { App } from '@nodearch/core';
import { AppFinder, ClassConstructor } from '@nodearch/core/utils';
import path from 'path';
import { register } from 'ts-node';
import { fileURLToPath } from 'url';


register({ cwd: fileURLToPath(new URL(import.meta.url)), compilerOptions: { esModuleInterop: true }, transpileOnly: true, esm: true, experimentalSpecifierResolution: 'node' });

async function main() {
  const LocalAppPath = await AppFinder.find(true);
  console.log('LocalAppPath', LocalAppPath);
  const LocalApp = await import(LocalAppPath!.href);
  // console.log('LocalApp', LocalApp);

  // let CliApp: ClassConstructor<App> | undefined;

  // // Try to load a local copy of the Cli
  // try {
  //   const localCliPath = path.join(process.cwd(), 'node_modules', '@nodearch', 'cli');
  //   CliApp = (await import(localCliPath))?.Cli;
  // }
  // catch(e: any) {}

  // if (!CliApp) {
  //   CliApp = (await import('./main.js')).Cli;
  // }

  // const app = new CliApp();
  // await app.init({
  //   mode: 'app',
  //   cwd: new URL('..', import.meta.url)
  // });
  // await app.start();
}
 
main().catch(e => {
  console.log(e);
  process.exit(1);
});
