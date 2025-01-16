import { AppContext, Service } from '@nodearch/core';
import { ClassConstructor, get } from '@nodearch/core/utils';
import { JsonataDecorator } from '../enums.js';


@Service({ export: true })
export class MappingService {
  constructor(
    private readonly appContext: AppContext
  ) {}

  transform(data: any, mapper: ClassConstructor) {
    const transformsComponents = this.appContext.getComponentRegistry().get({ id: JsonataDecorator.JsonataTransform });
    const transform = transformsComponents.find(t => t.getClass() === mapper);

    const getDecorators = transform?.getDecorators({ id: JsonataDecorator.JsonGet });
    
    let dataObj: any = {};

    getDecorators!.forEach(decorator => {

      const dataPath = decorator.data.path;
      const value = get(data, dataPath);

      console.log('decorator.dataType', decorator.dataType)
      
      const t = transformsComponents.find(t => t.getClass() === decorator.dataType as any);

      const d = t!.getDecorators({ id: JsonataDecorator.JsonGet });
      
      

      dataObj[decorator.property!] = value;

    });
    
    return dataObj;
  }
}