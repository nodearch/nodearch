import { Command, ICommand } from '@nodearch/command';
import { generate } from '../generator.js';

@Command()
export class CreateCommand implements ICommand {
  command = 'create';
  describe = 'Create Command';

  constructor(
  ) {}

  async handler(args: any) {
    console.log('Create Command');


    await generate('main.ts.tpl', { 
      className: 'NodeArch', 
      logPrefix: 'NodeArch', 
      extensions: [
        'ExpressApp', 'MochaApp'
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
  }
}