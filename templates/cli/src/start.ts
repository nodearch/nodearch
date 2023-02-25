import CliTemplate from './main.js';
import { fileURLToPath } from 'node:url';


async function main() {
  const app = new CliTemplate(true);

  await app.init({
    mode: 'app',
    appInfo: fileURLToPath(new URL('../package.json', import.meta.url))
  });

  await app.start();
}

main().catch(console.log);