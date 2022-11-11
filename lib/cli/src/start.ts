#!/usr/bin/env node

import { register } from 'ts-node';
import { Cli } from './main';

register({ transpileOnly: true });

async function main() {
  const app = new Cli();
  await app.run();
  await app.init();
  await app.start();
}
 
main().catch(e => {
  console.log(e);
  process.exit(1);
});
