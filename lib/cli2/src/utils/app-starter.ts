let rootDir = process.argv.find(x => x.startsWith('rootDir='));
let appPath = process.argv.find(x => x.startsWith('appPath='));

if (rootDir && appPath) {
  rootDir = rootDir.replace('rootDir=', '');
  appPath = appPath.replace('appPath=', '');

  const App = (await import(appPath)).default;
  const app = new App();

  await app.init({ mode: 'app', cwd: rootDir, typescript: true });
  await app.start();
}