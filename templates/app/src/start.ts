import { AppStage } from '@nodearch/core';
import MainApp from './main';

async function main() {
  const app = new MainApp();
  await app.run(AppStage.Start);
}

main().catch(console.log);