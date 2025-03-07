import { capitalizeFirstLetter } from '../lib/util';

export function getHookConfig(name: string) {
  return {
    imports: [
      {
        moduleName: '@nodearch/core',
        imported: ['Hook', 'IHook']
      }
    ],
    classDecorators: [
      {
        name: 'Hook'
      }
    ],
    className: capitalizeFirstLetter(name) + 'Hook'
  };
}