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

export interface IComponentInfo extends IComponentOptions {
  id: string;
  handler?: ClassConstructor<IComponentHandler>; 
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
    classDef: ClassConstructor;
    info: IComponentInfo;
}