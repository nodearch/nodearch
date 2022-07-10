import { injectable } from 'inversify';
import { ClassConstructor } from '../utils';
import { ComponentMetadata } from './component.metadata';
import { IComponentHandler, IComponentInfo, IComponentOptions } from './interfaces';


export abstract class ComponentFactory {
  static decorator(
    options: {
      id: string;
      handler?: ClassConstructor<IComponentHandler>;
      options?: IComponentOptions;
      fn?: (target: any) => void;
    }
  ): ClassDecorator {

    const compInfo: IComponentInfo = {
      id: options.id,
      handler: options.handler,
      options: options.options
    };

    return function (target: any) {
      options.fn?.(target);
      ComponentMetadata.setInfo<IComponentInfo>(target, compInfo);
      injectable()(target);
    }
  }
}