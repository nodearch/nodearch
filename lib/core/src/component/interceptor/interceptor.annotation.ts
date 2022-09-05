import { ControllerMetadata } from '../controller';
import { IComponentOptions } from "../interfaces";
import { IInterceptorConstructor, IInterceptorMetadataInfo } from './interceptor.interfaces';
import { ClassMethodDecorator } from '../../utils';
import { ComponentFactory } from '../component-factory';
import { CoreComponentId } from '../enums';


// TODO: validate that allowing Different scopes for Interceptors is fine
export const Interceptor = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreComponentId.Interceptor, options });

export function UseInterceptor<T>(guardClass: IInterceptorConstructor<T>, options: T): ClassMethodDecorator;
export function UseInterceptor(guardClass: IInterceptorConstructor, options?: undefined): ClassMethodDecorator;
export function UseInterceptor(guardClass: IInterceptorConstructor, options?: any): ClassMethodDecorator {
  return function(target: Object, propertyKey?: string) {

    if (propertyKey) {
      target = target.constructor;
    }

    ControllerMetadata.setInterceptor<IInterceptorMetadataInfo>(target, {
      classDef: guardClass,
      options,
      method: propertyKey
    });
  };
}