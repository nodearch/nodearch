import { injectable } from 'inversify';
import { ClassInfo } from '../utils/class-info.js';
import { ClassConstructor } from '../utils/types.js';
import { IDecoratorDependency, IComponentOptions } from './interfaces.js';
import { IComponentRegistration } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';
import { DecoratorType } from './enums.js';
import { generateResourceId } from '../utils/crypto.js';

/**
 * The `ComponentFactory` class provides static methods for creating decorators used in the dependency injection framework.
 * It allows the creation of decorators for components, classes, methods, parameters, and class methods.
 * These decorators are used to set metadata and handle dependency injection within the framework.
 * The class also provides utility methods for checking if a component is registered and retrieving decorator information.
 */
export class ComponentFactory {
  /**
   * Decorator method for creating a component decorator.
   *
   * @param options - Options for the component decorator.
   * @returns A class decorator.
   */
  static componentDecorator<T>(
    options: {
      id: string;
      options?: IComponentOptions;
      fn?(target: any): T | void;
      dependencies?: ClassConstructor[];
    }
  ): ClassDecorator {

    const compInfo: IComponentRegistration = {
      id: options.id,
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

  /**
   * Decorator method for creating a class decorator.
   *
   * @param options - Options for the class decorator.
   * @returns A class decorator.
   */
  static classDecorator<T>(
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
        dependencies: options.dependencies ? ComponentFactory.getComponentDependencies({
          target: decoratorTarget,
          decoratorId: options.id,
          depsInfo: options.dependencies
        }) : []
      });
    }
  }

  /**
   * Decorator method for creating a method decorator.
   *
   * @param options - Options for the method decorator.
   * @returns A method decorator.
   */
  static methodDecorator<T>(
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
        dependencies: options.dependencies ? ComponentFactory.getComponentDependencies({
          target: decoratorTarget,
          decoratorId: options.id,
          depsInfo: options.dependencies,
          propKey: (propKey as string)
        }) : []
      });
    }
  }

  /**
   * Decorator method for creating a parameter decorator.
   *
   * @param options - Options for the parameter decorator.
   * @returns A parameter decorator.
   */
  static parameterDecorator<T>(
    options: {
      id: string;
      fn?(target: any, propKey: string | symbol | undefined, paramIndex: number): T | void;
      dependencies?: ClassConstructor[];
    }
  ): ParameterDecorator {
    return function (target: any, propKey: string | symbol | undefined, paramIndex: number) {
      const decoratorTarget = target.constructor;

      const data = options.fn?.(target, propKey, paramIndex);

      ComponentMetadata.setComponentDecorator(decoratorTarget, {
        type: DecoratorType.PARAMETER,
        id: options.id,
        method: propKey as string,
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

  /**
   * Decorator method for creating a class method decorator.
   *
   * @param options - Options for the class method decorator.
   * @returns A class method decorator.
   */
  static classMethodDecorator<T>(
    options: {
      id: string;
      fn?(target: any, propKey?: string | symbol): T | void;
      dependencies?: ClassConstructor[];
    }
  ) {
    return function (target: any, propKey?: string | symbol) {
      const decoratorTarget = propKey ? target.constructor : target;

      const data = options.fn?.(target, propKey);

      ComponentMetadata.setComponentDecorator(decoratorTarget, {
        type: DecoratorType.CLASS_METHOD,
        id: options.id,
        method: propKey as string,
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

  /**
   * Checks if a given component is registered with a specific id.
   *
   * @param component - The component to check.
   * @param id - The id of the component to check (optional).
   * @returns A boolean indicating if the component is registered with the given id.
   */
  static isComponent(component: any, id?: string) {
    const registry = ComponentMetadata.getComponentRegistration(component);

    if (!registry) return false;
    if (id && registry.id !== id) return false;

    return true;
  }

  /**
   * Retrieves decorator information for a specific class and id.
   *
   * @param classConstructor - The class constructor.
   * @param id - The id of the decorator to retrieve.
   * @returns An array of decorator information objects.
   */
  static getDecoratorInfo(classConstructor: ClassConstructor, id: string) {
    return ComponentMetadata
      .getComponentDecorators(classConstructor)
      .filter(x => x.id === id);
  }

  private static getComponentDependencies(options: {
    depsInfo: ClassConstructor<any>[];
    decoratorId: string;
    propKey?: string;
    target: any;
  }) {
    let dependencies: IDecoratorDependency[] = [];

    if (options.depsInfo) {
      dependencies = ComponentFactory.addComponentDependencies(options.target, options.depsInfo);
    }

    return dependencies;
  }

  private static addComponentDependencies(component: ClassConstructor, dependencies: ClassConstructor[]): IDecoratorDependency[] {
    return dependencies.map(dep => {
      const key = generateResourceId();

      ClassInfo.propertyInject(component, dep, key);

      return { key, component: dep };
    });
  }
}