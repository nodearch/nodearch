import { ControllerMetadata } from '../controller';
import { ComponentMetadata } from '../component.metadata';
import { ComponentType } from '../enums';
import { injectable } from 'inversify';
import { IComponentInfo, IComponentOptions } from "../interfaces";
import { IInterceptorConstructor, IInterceptorMetadataInfo } from './interceptor.interfaces';
import { ClassMethodDecorator } from '../../utils';


// TODO: validate that allowing Different scopes for Interceptors is fine
export function InterceptorProvider(options?: IComponentOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      scope: options?.scope,
      type: ComponentType.InterceptorProvider,
      id: options?.id
    });
    injectable()(target);
  }
}

export function Interceptor<T>(guardClass: IInterceptorConstructor<T>, options: T): ClassMethodDecorator;
export function Interceptor(guardClass: IInterceptorConstructor, options?: undefined): ClassMethodDecorator;
export function Interceptor(guardClass: IInterceptorConstructor, options?: any): ClassMethodDecorator {
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