import { injectable } from 'inversify';
import { ClassInfo } from '../utils/class-info.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentHandler } from './handler.js';
import { IComponentDecoratorDependency, IComponentOptions } from './interfaces.js';
import { IComponentRegistration } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';


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

    return function (decoratorTarget: any) {
      compInfo.data = options.fn?.(decoratorTarget);

      compInfo.dependencies = options.dependencies ? ComponentFactory.getComponentDependencies({ 
        target: decoratorTarget, 
        decoratorId: options.id, 
        depsInfo: options.dependencies
      }) : [];
      
      ComponentMetadata.setComponentRegistration(decoratorTarget, compInfo);
      injectable()(decoratorTarget);
    }
  }

  static classDecorator(
    options: {
      id: string;
      fn?(target: any): object | void;
      dependencies?: ClassConstructor[];
    }
  ): ClassDecorator {
    return function (decoratorTarget: any) {

      const data = options.fn?.(decoratorTarget);

      ComponentMetadata.setComponentDecorator(decoratorTarget, {
        id: options.id,
        data,
        dependencies: options.dependencies ? ComponentFactory.getComponentDependencies({ 
          target: decoratorTarget, 
          decoratorId: options.id, 
          depsInfo: options.dependencies
        }) : []
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
      const decoratorTarget = target.constructor;

      const data = options.fn?.(target, propKey);

      ComponentMetadata.setComponentDecorator(decoratorTarget, {
        id: options.id,
        method: propKey,
        data,
        dependencies: options.dependencies ? ComponentFactory.getComponentDependencies({ 
          target: decoratorTarget, 
          decoratorId: options.id, 
          depsInfo: options.dependencies, 
          propKey: (propKey as string) 
        }) : []
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
      const decoratorTarget = target.constructor;

      const data = options.fn?.(target, propKey, paramIndex);

      ComponentMetadata.setComponentDecorator(decoratorTarget, {
        id: options.id,
        method: propKey,
        paramIndex: paramIndex,
        data,
        dependencies: options.dependencies ? ComponentFactory.getComponentDependencies({ 
          target: decoratorTarget, 
          decoratorId: options.id, 
          depsInfo: options.dependencies, 
          propKey: (propKey as string) 
        }) : []
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
        dependencies: options.dependencies ? ComponentFactory.getComponentDependencies({ 
          target: decoratorTarget, 
          decoratorId: options.id, 
          depsInfo: options.dependencies, 
          propKey: (propKey as string) 
        }) : []
      });
    }
  }

  static isComponent(component: any, id?: string) {
    const registry = ComponentMetadata.getComponentRegistration(component);
    
    if (!registry) return false;
    if (id && registry.id !== id) return false;
    
    return true;
  }

  static addComponentDependency(component: ClassConstructor, dependency: ClassConstructor, prefix: string) {
    const key = `${prefix}-${dependency.name}`;
    ClassInfo.propertyInject(component, dependency, key)
    return key;
  }

  static addComponentDependencies(component: ClassConstructor, dependencies: ClassConstructor[], prefix: string): IComponentDecoratorDependency[] {
    return dependencies.map(dep => {
      const key = ComponentFactory.addComponentDependency(component, dep, prefix);
      return { key, component: dep };
    });
  }

  private static getComponentDependencies(options: {
    depsInfo: ClassConstructor<any>[];
    decoratorId: string;
    propKey?: string;
    target: any;
  }) {
    let dependencies: IComponentDecoratorDependency[] | undefined;
      
    if (options.depsInfo) {
      const prefix = `${options.decoratorId}/dependency/${options.target.name}${options.propKey? '-' + options.propKey as string : ''}`;
      dependencies = ComponentFactory.addComponentDependencies(options.target, options.depsInfo, prefix);
    }

    return dependencies;
  }
}