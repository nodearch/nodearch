import { Container } from 'inversify';
import { ClassConstructor } from '../utils/types.js';
import { ComponentScope } from './enums.js';
import { ComponentHandler } from './handler.js';
import { ComponentInfo } from './info.js';


export interface IComponentsOptions {
  // Components default scope ( Singleton if not provided )
  defaultScope?: ComponentScope;
}

export interface IComponentDecorator<T = any> {
  
  /**
   * The id used to register and identify this decorator
   */
  id: string;

  /**
   * Available only for method decorator
   */
  method?: string | symbol; 
  
  /**
   * Available only for parameter decorator 
   */
  paramIndex?: number;
  
  /**
   * Data passed by the decorator implementation
   */
  data?: T;
  
  /**
   * Information about all registered dependencies (components)
   * added by this decorator instance. Use the key to find the instance 
   * of your dependency on the target (the component this decorator is placed on)
   */
  dependencies?: IComponentDecoratorDependency[];
}

export interface IComponentDecoratorDependency {
  key: string;
  component: ClassConstructor;
}

export interface IComponentHandler {
  register(componentInfo: ComponentInfo): void;
  registerExtension?(componentInfo: ComponentInfo, extContainer: Container): void;
}

export interface IComponentOptions {
  scope?: ComponentScope;
  namespace?: string;
  export?: boolean;
}

export interface IComponentRegistration<T = any> {
  id: string;
  handler?: ClassConstructor<ComponentHandler>;
  options?: IComponentOptions;
  data?: T;
  /**
   * Information about all registered dependencies (components)
   * added by this decorator instance. Use the key to find the instance 
   * of your dependency on the target (the component this decorator is placed on)
   */
  dependencies?: IComponentDecoratorDependency[];
}

export interface IGetComponentsOptions {
  // Filter by component id
  id?: string;
  
  // Filter by decorator id for a decorator that is placed on the component
  decoratorIds?: string[];
}