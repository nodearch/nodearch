import { injectable } from 'inversify';
import { ClassConstructor } from '../../utils';
import { ComponentMetadata } from './metadata';
import { IComponentOptions } from '../interfaces';
import { IComponentRegistration } from './interfaces';
import { ComponentHandler } from '../handler';


export abstract class ComponentFactory {
  
  /**
   * The component decorator factory is used to flag a given class
   * as a compatible component type that will be loaded by nodearch
   * automatically and made available to all extensions and apps.
   */
  static componentDecorator(
    options: {
      id: string;
      handler?: ClassConstructor<ComponentHandler>;
      options?: IComponentOptions;
      fn?(target: any): object | void;
    }
  ): ClassDecorator {

    const compInfo: IComponentRegistration = {
      id: options.id,
      handler: options.handler,
      options: options.options
    };

    return function (target: any) {
      compInfo.data = options.fn?.(target);
      ComponentMetadata.setComponentRegistration(target, compInfo);
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

  // TODO: do we need this? or just support global flag on class decorator 
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