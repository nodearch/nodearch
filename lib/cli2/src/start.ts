#!/usr/bin/env ts-node

import { App } from '@nodearch/core';
import { CommandAnnotation } from '@nodearch/command';
import { AppFinder, ClassConstructor } from '@nodearch/core/utils';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';


async function main() {
  const LocalApp = await AppFinder.loadApp(true)

  if (LocalApp) {
    // TODO: move this to inside the app so we can control the flow
    // First, we load the local app and get the commands
    // Second, we trigger the command module and pass the local command to it
    // That requires a change in the command module. So, instead of starting the 
    // interactive cli from the hook automatically, we'll add it to a service 
    // so we can trigger it manually, but also maybe provide a flag to trigger it automatically
    const localApp = new LocalApp();
    await localApp.init({ mode: 'app', cwd: pathToFileURL(process.cwd()) });
    console.log(localApp.getAll(CommandAnnotation.Command));
  }

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
