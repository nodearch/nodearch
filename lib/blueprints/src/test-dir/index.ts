import { Generator } from '../index';
import path from 'path';

const tmpAppDir = path.join(__dirname, '../../tmp-app');

async function main() {

  const generator = new Generator();

  // await recipes.service('user', tmpAppDir);
  // await recipes.repository('user', tmpAppDir);
  // await generator.hook('user', { className: 'User' }, tmpAppDir);
  // await generator.controller('user', { className: 'User' }, tmpAppDir);

  await generator.app({
    appName: 'my app',
    appDescription: 'This is my new application',
    extensions: {
      mocha: true,
      express: true
    }
  }, tmpAppDir);

}

main().catch(console.error);