import { injectable } from 'inversify';
import { ClassConstructor } from '../utils';
import { ComponentMetadata } from './component.metadata';
import { IComponentHandler, IComponentInfo, IComponentOptions } from './interfaces';


export abstract class ComponentFactory {
  static componentDecorator(
    options: {
      id: string;
      handler?: ClassConstructor<IComponentHandler>;
      options?: IComponentOptions;
      fn?(target: any): object | void;
    }
  ): ClassDecorator {

    const compInfo: IComponentInfo = {
      id: options.id,
      handler: options.handler,
      options: options.options
    };

    return function (target: any) {
      compInfo.data = options.fn?.(target);
      ComponentMetadata.setComponentInfo(target, compInfo);
      injectable()(target);
    }
  }

  static classDecorator(
    options: {
      id: string;
      fn?(target: any): object | void;
    }
  ): ClassDecorator {
    return function (target: any) {

      const data = options.fn?.(target);

      ComponentMetadata.setComponentDecorator(target.constructor, {
        id: options.id,
        data
      });
    }
  }

  static methodDecorator(
    options: {
      id: string;
      fn?(target: any, propKey: string | symbol): object | void;
    }
  ): MethodDecorator {
    return function (target: any, propKey: string | symbol) {

      const data = options.fn?.(target, propKey);

      ComponentMetadata.setComponentDecorator(target.constructor, {
        id: options.id,
        method: propKey,
        data
      });
    }
  }

  static parameterDecorator(
    options: {
      id: string;
      fn?(target: any, propKey: string | symbol, paramIndex: number): object | void;
    }
  ): ParameterDecorator {
    return function (target: any, propKey: string | symbol, paramIndex: number) {
      const data = options.fn?.(target, propKey, paramIndex);

      ComponentMetadata.setComponentDecorator(target.constructor, {
        id: options.id,
        method: propKey,
        paramIndex: paramIndex,
        data
      });
    }
  }

  static globalDecorator(
    options: {
      id: string;
      fn?(target: any, propKey?: string | symbol): object | void;
    }
  ) {
    return function(target: any, propKey?: string | symbol) {
      const decoratorTarget = propKey ? target.constructor : target;
      
      const data = options.fn?.(target, propKey);
    
      ComponentMetadata.setComponentDecorator(decoratorTarget, {
        id: options.id,
        method: propKey,
        global: true,
        data
      });
    }
  }
}