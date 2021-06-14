import { RunMode } from '../../../system/core/dist';
import MainApp from './main';

async function main() {
  const app = new MainApp();
  await app.run({ mode: RunMode.APP });
}

main().catch(console.log);