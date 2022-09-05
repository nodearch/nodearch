import { Container } from 'inversify';
import { ClassConstructor } from '../utils';
import { ComponentScope } from './enums';

export interface IComponentsOptions {
  // Components default scope ( Singleton if not provided )
  defaultScope?: ComponentScope;
}

export interface IComponentOptions {
  scope?: ComponentScope;
  namespace?: string | symbol;
  export?: boolean;
}

// TODO: update IComponentMetadata
export interface IComponentInfo {
  id: string;
  handler?: ClassConstructor<IComponentHandler>; 
  options?: IComponentOptions;
  data?: any;
}

export interface IComponentDecorator {
  id: string;
  method?: string | symbol; // Available only for class decorator 
  paramIndex?: number; // Available only for parameter decorator
  global?: boolean;  // Apply to all methods of the component
  data?: any; // Additional options
}

export interface IComponentRegistryInfo {
  classConstructor: ClassConstructor;
  componentInfo: IComponentInfo;  
  decorators: IComponentDecorator[];
  getInstance: () => any;
}



export interface IComponentHandler {
  register(classDef: ClassConstructor, componentInfo: IComponentInfo): void;
  registerExtension?(classDef: ClassConstructor, componentInfo: IComponentInfo, extContainer: Container): void;
}

export interface IBindComponentOptions extends IComponentInfo {
  component: ClassConstructor;
}

export interface IBindExtComponentOptions extends IBindComponentOptions {
  extContainer: Container;
}

export interface IProxyMethodOptions {
  target: any;
  before?(methodName: string, args: any[], paramTypes: string[]): Promise<boolean>;
  after?(methodName: string, args: any[], paramTypes: string[]): Promise<boolean>;
}

export interface IExportedComponent {
    classConstructor: ClassConstructor;
    info: IComponentInfo;
}