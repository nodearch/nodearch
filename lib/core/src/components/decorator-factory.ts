import { injectable } from 'inversify';
import { ClassInfo } from '../utils/class-info.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentHandler } from './component-handler.js';
import { IDecoratorDependency, IComponentOptions } from './interfaces.js';
import { IComponentRegistration } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';
import { DecoratorType } from './enums.js';
import { generateResourceId } from '../utils/crypto.js';


/**
 * The component decorator factory is used to flag a given class
 * as a compatible component type that will be loaded by nodearch
 * automatically and made available to all extensions and apps.
 */
export function componentDecorator<T>(
  options: {
    id: string;
    handler?: ClassConstructor<ComponentHandler>;
    options?: IComponentOptions;
    fn?(target: any): T | void;
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

    compInfo.dependencies = options.dependencies ? getComponentDependencies({ 
      target: decoratorTarget, 
      decoratorId: options.id, 
      depsInfo: options.dependencies
    }) : [];

    ComponentMetadata.setComponentRegistration(decoratorTarget, compInfo);
    injectable()(decoratorTarget);
  }
}

export function classDecorator<T>(
  options: {
    id: string;
    fn?(target: any): T | void;
    dependencies?: ClassConstructor[];
  }
): ClassDecorator {
  return function (decoratorTarget: any) {

    const data = options.fn?.(decoratorTarget);

    ComponentMetadata.setComponentDecorator(decoratorTarget, {
      type: DecoratorType.CLASS,
      id: options.id,
      data,
      dependencies: options.dependencies ? getComponentDependencies({ 
        target: decoratorTarget, 
        decoratorId: options.id, 
        depsInfo: options.dependencies
      }) : []
    });
  }
}

export function methodDecorator<T>(
  options: {
    id: string;
    fn?(target: any, propKey: string | symbol, descriptor: PropertyDescriptor): T | void;
    dependencies?: ClassConstructor[];
  }
): MethodDecorator {
  return function (target: any, propKey: string | symbol, descriptor: PropertyDescriptor) {
    const decoratorTarget = target.constructor;

    const data = options.fn?.(target, propKey, descriptor);

    ComponentMetadata.setComponentDecorator(decoratorTarget, {
      type: DecoratorType.METHOD,
      id: options.id,
      method: propKey as string,
      data,
      dependencies: options.dependencies ? getComponentDependencies({ 
        target: decoratorTarget, 
        decoratorId: options.id, 
        depsInfo: options.dependencies, 
        propKey: (propKey as string) 
      }) : []
    });
  }
}

export function parameterDecorator<T>(
  options: {
    id: string;
    fn?(target: any, propKey: string | symbol, paramIndex: number): T | void;
    dependencies?: ClassConstructor[];
  }
): ParameterDecorator {
  return function (target: any, propKey: string | symbol, paramIndex: number) {
    const decoratorTarget = target.constructor;

    const data = options.fn?.(target, propKey, paramIndex);

    ComponentMetadata.setComponentDecorator(decoratorTarget, {
      type: DecoratorType.PARAMETER,
      id: options.id,
      method: propKey as string,
      paramIndex: paramIndex,
      data,
      dependencies: options.dependencies ? getComponentDependencies({ 
        target: decoratorTarget, 
        decoratorId: options.id, 
        depsInfo: options.dependencies, 
        propKey: (propKey as string) 
      }) : []
    });
  }
}

export function classMethodDecorator<T>(
  options: {
    id: string;
    fn?(target: any, propKey?: string | symbol): T | void;
    dependencies?: ClassConstructor[];
  }
) {
  return function(target: any, propKey?: string | symbol) {
    const decoratorTarget = propKey ? target.constructor : target;

    const data = options.fn?.(target, propKey);

    ComponentMetadata.setComponentDecorator(decoratorTarget, {
      type: DecoratorType.CLASS_METHOD,
      id: options.id,
      method: propKey as string,
      data,
      dependencies: options.dependencies ? getComponentDependencies({ 
        target: decoratorTarget, 
        decoratorId: options.id, 
        depsInfo: options.dependencies, 
        propKey: (propKey as string) 
      }) : []
    });
  }
}

export function isComponent(component: any, id?: string) {
  const registry = ComponentMetadata.getComponentRegistration(component);

  if (!registry) return false;
  if (id && registry.id !== id) return false;
  
  return true;
}

export function getDecoratorInfo(classConstructor: ClassConstructor, id: string) {
  return ComponentMetadata
    .getComponentDecorators(classConstructor)
    .filter(x => x.id === id);
}

function getComponentDependencies(options: {
  depsInfo: ClassConstructor<any>[];
  decoratorId: string;
  propKey?: string;
  target: any;
}) {
  let dependencies: IDecoratorDependency[] = [];
    
  if (options.depsInfo) {
    dependencies = addComponentDependencies(options.target, options.depsInfo);
  }

  return dependencies;
}

function addComponentDependencies(component: ClassConstructor, dependencies: ClassConstructor[]): IDecoratorDependency[] {
  return dependencies.map(dep => {
    const key = generateResourceId();
    
    ClassInfo.propertyInject(component, dep, key);

    return { key, component: dep };
  });
}