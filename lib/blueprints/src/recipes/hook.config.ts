import { IComponentTs } from '../interfaces';
import { capitalizeFirstLetter } from '../lib/util';

export function getHookConfig(name: string): IComponentTs {
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
    interfaces: ['IHook'],
    methods: [
      {
        name: 'onStart',
        async: true,
        body: onStartMessage,
      },
      {
        name: 'onStop',
        async: true,
        body: onStopMessage
      }
    ],
    className: capitalizeFirstLetter(name) + 'Hook'
  };
}

const onStartMessage = '/**' +
  '\n\t\t* Logic goes here will be executed on the application starting' +
  '\n\t\t* The application will not start until this method is resolved' +
  '\n\t\t* If you throw an error, the application will not start' +
  '\n\t\t*/';

const onStopMessage = '/**' +
  '\n\t\t* Logic goes here will be executed on the application stopping' +
  '\n\t\t* The application will not stop until this method is resolved' +
  '\n\t\t* If you throw an error, the application stop regardless' +
  '\n\t\t*/';
