import { Container } from 'inversify';
import { ComponentScope } from './enums';
import { ComponentInfo } from './registration/info';

export interface IComponentsOptions {
  // Components default scope ( Singleton if not provided )
  defaultScope?: ComponentScope;
}

export interface IComponentDecorator {
  id: string;
  method?: string | symbol; // Available only for class decorator 
  paramIndex?: number; // Available only for parameter decorator
  global?: boolean;  // Apply to all methods of the component
  data?: any; // Additional options
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