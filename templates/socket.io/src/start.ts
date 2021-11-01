import { RunMode } from '@nodearch/core';
import MainApp from './main';

async function main() {
  const app = new MainApp();
  await app.run({ mode: RunMode.APP });
}

main().catch(console.log);