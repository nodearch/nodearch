import { Recipes } from '../index';
import path from 'path';

const tmpAppDir = path.join(__dirname, '../../tmp-app');

async function main() {

  const recipes = new Recipes();

  // await recipes.standardApp({
  //   appName: 'my app',
  //   appDescription: 'This is my new application',
  // }, tmpAppDir);

  await recipes.hook('user', tmpAppDir);

}

main().catch(console.error);