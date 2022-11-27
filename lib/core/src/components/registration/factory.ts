import { inject, injectable } from 'inversify';
import { ClassConstructor } from '../../utils';
import { ComponentMetadata } from './metadata';
import { IComponentDecoratorDependency, IComponentOptions } from '../interfaces';
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
      dependencies?: ClassConstructor[];
    }
  ): ClassDecorator {

    const compInfo: IComponentRegistration = {
      id: options.id,
      handler: options.handler,
      options: options.options
    };

    return function (target: any) {
      compInfo.data = options.fn?.(target);
      
      compInfo.dependencies = options.dependencies ? 
        ComponentFactory.addComponentDependencies(target, options.dependencies) : [];
      
      ComponentMetadata.setComponentRegistration(target, compInfo);
      injectable()(target);
    }
  }

  static classDecorator(
    options: {
      id: string;
      fn?(target: any): object | void;
      dependencies?: ClassConstructor[];
    }
  ): ClassDecorator {
    return function (target: any) {

      const data = options.fn?.(target);

      ComponentMetadata.setComponentDecorator(target, {
        id: options.id,
        data,
        dependencies: options.dependencies ? 
          ComponentFactory.addComponentDependencies(target, options.dependencies) : []
      });
    }
  }

  static methodDecorator(
    options: {
      id: string;
      fn?(target: any, propKey: string | symbol): object | void;
      dependencies?: ClassConstructor[];
    }
  ): MethodDecorator {
    return function (target: any, propKey: string | symbol) {

      const data = options.fn?.(target, propKey);

      ComponentMetadata.setComponentDecorator(target.constructor, {
        id: options.id,
        method: propKey,
        data,
        dependencies: options.dependencies ? 
          ComponentFactory.addComponentDependencies(target.constructor, options.dependencies) : []
      });
    }
  }

  static parameterDecorator(
    options: {
      id: string;
      fn?(target: any, propKey: string | symbol, paramIndex: number): object | void;
      dependencies?: ClassConstructor[];
    }
  ): ParameterDecorator {
    return function (target: any, propKey: string | symbol, paramIndex: number) {
      const data = options.fn?.(target, propKey, paramIndex);

      ComponentMetadata.setComponentDecorator(target.constructor, {
        id: options.id,
        method: propKey,
        paramIndex: paramIndex,
        data,
        dependencies: options.dependencies ? 
          ComponentFactory.addComponentDependencies(target.constructor, options.dependencies) : []
      });
    }
  }

  static classMethodDecorator(
    options: {
      id: string;
      fn?(target: any, propKey?: string | symbol): object | void;
      dependencies?: ClassConstructor[];
    }
  ) {
    return function(target: any, propKey?: string | symbol) {
      const decoratorTarget = propKey ? target.constructor : target;
      
      const data = options.fn?.(target, propKey);
    
      ComponentMetadata.setComponentDecorator(decoratorTarget, {
        id: options.id,
        method: propKey,
        data,
        dependencies: options.dependencies ? 
          ComponentFactory.addComponentDependencies(decoratorTarget, options.dependencies) : []
      });
    }
  }

  static isComponent(component: any, id?: string) {
    const registry = ComponentMetadata.getComponentRegistration(component);
    
    if (!registry) return false;
    if (id && registry.id !== id) return false;
    
    return true;
  }

  static addComponentDependency(component: ClassConstructor, dependency: ClassConstructor) {
    const key: any = Symbol(dependency.name);
    inject(dependency)(component, key);
    return key;
  }

  static addComponentDependencies(component: ClassConstructor, dependencies: ClassConstructor[]): IComponentDecoratorDependency[] {
    return dependencies.map(dep => {
      const key = ComponentFactory.addComponentDependency(component, dep);
      
      return { key, component };
    });
  }
}