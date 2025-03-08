import { Recipes } from '../index';
import path from 'path';

const tmpAppDir = path.join(__dirname, '../../tmp-app');

async function main() {

  const recipes = new Recipes();

  await recipes.standardApp({
    appName: 'my app',
    appDescription: 'This is my new application',
  }, tmpAppDir);

  // await recipes.hook('user', tmpAppDir);

  // await recipes.controller('user', tmpAppDir, {
  //   classDecorators: [
  //     { name: 'HttpPath', options: [{ key: 'path', value: '/one' }] }
  //   ],
  //   methods: [
  //     {
  //       name: 'get',
  //       decorators: [
  //         { name: 'Get' }
  //       ],
  //       async: true,
  //       parameters: [
  //         {
  //           name: 'req',
  //           type: 'Request',
  //           decorators: [
  //             { name: 'HttpReq' }
  //           ]
  //         },
  //         {
  //           name: 'res',
  //           type: 'Response',
  //           decorators: [
  //             { name: 'HttpRes' }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // });

}

main().catch(console.error);