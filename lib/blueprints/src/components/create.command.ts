import { Command, ICommand } from '@nodearch/command';
import * as generate from '../lib/generator.js';

@Command()
export class CreateCommand implements ICommand {
  command = 'create';
  describe = 'Create Command';

  constructor(
  ) {}

  async handler(args: any) {
    console.log('Create Command');


    await generate.mainTs({ 
      className: 'NodeArch', 
      logPrefix: 'NodeArch', 
      extensions: [
        { 
          name: 'ExpressApp',
          options: [
            { key: 'port', value: { lol: 'one' } }
          ]
        },
        { name: 'MochaApp' }
      ],
      imports: [
        {
          moduleName: '@nodearch/core',
          imported: ['App']
        },
        {
          moduleName: '@nodearch/express',
          imported: ['ExpressApp']
        },
        {
          moduleName: '@nodearch/mocha',
          imported: ['MochaApp', 'MochaApp2']
        }
      ] 
    }, new URL('./lol.ts', import.meta.url));

    // await generate.packageJson({ 
    //   packageName: 'something' 
    // }, new URL('./lol.ts', import.meta.url));

  }
}