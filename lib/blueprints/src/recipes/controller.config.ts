import { ExtraComponentInfo, IComponentTs } from '../interfaces';
import { capitalizeFirstLetter } from '../lib/util';

export function getControllerConfig(name: string, extraComponentInfo?: ExtraComponentInfo): IComponentTs {
  const controllerConfig: IComponentTs = {
    imports: [
      {
        moduleName: '@nodearch/core',
        imported: ['Controller']
      }
    ],
    classDecorators: [
      {
        name: 'Controller'
      }
    ],
    methods: [],
    interfaces: [],
    className: capitalizeFirstLetter(name) + 'Controller'
  };

  if (extraComponentInfo) {
    extraComponentInfo.imports && controllerConfig.imports.push(...extraComponentInfo.imports);
    extraComponentInfo.classDecorators && controllerConfig.classDecorators.push(...extraComponentInfo.classDecorators);
    extraComponentInfo.methods && controllerConfig.methods!.push(...extraComponentInfo.methods);
    extraComponentInfo.interfaces && controllerConfig.interfaces!.push(...extraComponentInfo.interfaces);
  }

  return controllerConfig;
}