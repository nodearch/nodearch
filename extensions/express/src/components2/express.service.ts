import { Service, IComponentRegistryInfo } from '@nodearch/core';
import { ExpressAnnotationId } from '../enums';


interface IRouteInfo {

}

@Service()
export class ExpressService {
  async init(controllers: IComponentRegistryInfo[]) {
    controllers.forEach(controller => {

      controller.componentInfo.methods.forEach(method => {
        
      });

      controller.decorators.forEach(decorator => {
        decorator.id === ExpressAnnotationId.HttpMethod
      });
    });
  }
}