import { pathToFileURL } from 'url';

async function main() {
  let path = process.argv.find(x => x.startsWith('path='));

  if (path) {
    path = path.replace('path=', '');

    const App = (await import(path)).default;
    const app = new App();

    await app.init({ mode: 'app', cwd: pathToFileURL(process.cwd()), typescript: true });
    await app.start();
  }
}

main().catch(console.log);