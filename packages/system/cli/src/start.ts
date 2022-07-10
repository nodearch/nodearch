#!/usr/bin/env node

import { Cli } from './main';
import { register } from 'ts-node';


async function main() {
  register({ transpileOnly: true });
  const app = new Cli();
  await app.run();
}

main().catch(e => {
  console.log(e);
  process.exit(1);
});
