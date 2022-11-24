import { Container } from 'inversify';
import { ComponentScope } from './enums';
import { ComponentInfo } from './registration/info';

export interface IComponentsOptions {
  // Components default scope ( Singleton if not provided )
  defaultScope?: ComponentScope;
}

export interface IComponentDecorator<T = any> {
  id: string;
  method?: string | symbol; // Available only for class decorator 
  paramIndex?: number; // Available only for parameter decorator
  data?: T; // Additional options
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