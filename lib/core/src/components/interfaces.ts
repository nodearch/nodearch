import { Container } from 'inversify';
import { ClassConstructor } from '../utils';
import { ComponentScope } from './enums';
import { ComponentInfo } from './registration/info';

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
  namespace?: string | symbol;
  export?: boolean;
}