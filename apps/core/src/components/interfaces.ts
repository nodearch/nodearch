import { Container } from 'inversify';
import { ClassConstructor } from '../utils';
import { ComponentType, ComponentScope } from './enums';

export interface IComponentsOptions {
  // Components default scope ( Singleton if not provided )
  defaultScope?: ComponentScope;
}

export interface IComponentOptions {
  scope?: ComponentScope;
  id?: string | symbol;
}

export interface IComponentInfo {
  scope?: ComponentScope;
  type: ComponentType;
  id?: string | symbol;
}

export interface IComponentHandler {
  register(classDef: ClassConstructor, componentInfo: IComponentInfo): void;
  registerExtension(classDef: ClassConstructor, extContainer: Container): void;
}

export interface IBindComponentOptions {
  componentInfo: IComponentInfo;
  component: ClassConstructor;
  type?: string | symbol;
  id?: string | symbol;
}

export interface IBindExtComponentOptions extends Omit<IBindComponentOptions, 'componentInfo'> {
  extContainer: Container;
}

export interface IProxyMethodOptions {
  target: any;
  before?(methodName: string, args: any[], paramTypes: string[]): Promise<boolean>;
  after?(methodName: string, args: any[], paramTypes: string[]): Promise<boolean>;
}