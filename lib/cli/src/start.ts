#!/usr/bin/env node

import { App, ClassConstructor } from '@nodearch/core';
import path from 'path';
import { register } from 'ts-node';


register({ transpileOnly: true });

async function main() {
  let CliApp: ClassConstructor<App> | undefined;

  // Try to load a local copy of the Cli
  try {
    const localCliPath = path.join(process.cwd(), 'node_modules', '@nodearch', 'cli');
    CliApp = (await import(localCliPath))?.Cli;
  }
  catch(e: any) {}

  if (!CliApp) {
    CliApp = (await import('./main')).Cli;
  }

  const app = new CliApp();
  await app.run();
  await app.init();
  await app.start();
}
 
main().catch(e => {
  console.log(e);
  process.exit(1);
});
