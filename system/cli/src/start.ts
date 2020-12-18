#!/usr/bin/env node

import { AppStage } from '@nodearch/core';
import { CLI } from './main';
import { register } from 'ts-node';


async function main() {
  register({ transpileOnly: false });
  const app = new CLI();
  await app.run(AppStage.Start);
}

main().catch(e => {
  console.log(e);
  process.exit(1);
});