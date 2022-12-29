import path from 'path';
import CliTemplate from './main';


async function main() {
  const app = new CliTemplate(true);

  await app.init({
    mode: 'app',
    appInfo: path.join(__dirname, '..', 'package.json')
  });

  await app.start();
}

main().catch(console.log);