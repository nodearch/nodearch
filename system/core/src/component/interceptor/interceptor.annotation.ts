import { ControllerMetadata } from '../controller';
import { ComponentMetadata } from '../component.metadata';
import { ComponentType } from '../enums';
import { injectable } from 'inversify';
import { IComponentInfo, IComponentOptions } from "../interfaces";
import { IInterceptorConstructor, IInterceptorMetadataInfo } from './interceptor.interfaces';
import { ClassMethodDecorator } from '../../utils';


// TODO: validate that allowing Different scopes for Interceptors is fine
export function Interceptor(options?: IComponentOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      ...options,
      type: ComponentType.Interceptor
    });
    injectable()(target);
  }
}

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