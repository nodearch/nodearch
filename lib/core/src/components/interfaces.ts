import { Container } from '../container/container.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentScope, DecoratorType } from './enums.js';
import { ComponentInfo } from './component-info.js';


export interface IComponentsOptions {
  // Components default scope ( Singleton if not provided )
  defaultScope?: ComponentScope;
}

export type IComponentDecorator<T = any> = {
  /**
   * The id used to register and identify this decorator
   */
  id: string;

  /**
   * The type of the decorator (class, method or parameter)
   */
  type: DecoratorType;

  /**
   * Available only for method decorator
   */
  method?: string;

  /**
   * Available only for parameter decorator 
   */
  paramIndex?: number;

  /**
   * Data passed by the decorator implementation
   */
  data: T;

  /**
   * Information about all registered dependencies (components)
   * added by this decorator instance. Use the key to find the instance 
   * of your dependency on the target (the component this decorator is placed on)
   */
  dependencies: IDecoratorDependency[];
};

export interface IDecoratorDependency {
  key: string;
  component: ClassConstructor;
}

export interface IComponentHandler {
  register(componentInfo: ComponentInfo): void;
  registerExtension?(componentInfo: ComponentInfo, extContainer: Container): void;
}

export interface IComponentRegistration<T = any> {
  id: string;
  options?: IComponentOptions;
  data?: T;
  /**
   * Information about all registered dependencies (components)
   * added by this decorator instance. Use the key to find the instance 
   * of your dependency on the target (the component this decorator is placed on)
   */
  dependencies?: IDecoratorDependency[];
}

export interface IGetComponentsOptions {
  /** The ID of the decorator used to filter the list. */
  id?: string;
  /** An array of decorator IDs to filter the list by. */
  decoratorIds?: string[];
}

export interface IComponentOptions {
  scope?: ComponentScope;
  namespace?: string;
  export?: boolean;
}

export interface IGetDecoratorsOptions {
  /** Get all decorators that have this id */
  id?: string;

  /** Get all decorators that are placed on this method */
  method?: string;

  /** Get all `Use` decorators where the passed component id matches this id */ 
  useId?: string;

  /** Get all decorators based on their placement on the component */
  placement?: DecoratorType[];
}

export interface IBinderBindOptions {
  container: Container;
  componentClass: ClassConstructor;
  id: string;
  scope?: ComponentScope;
  namespace?: string;
}