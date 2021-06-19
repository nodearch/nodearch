import { Container } from 'inversify';
import ts from 'typescript';
import { ClassConstructor } from '../utils';
import { ComponentType, ComponentScope, AppState } from './enums';

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

export interface ITypeDocs {
  name?: string; // property name
  type?: string;
  tags?: ts.JSDocTagInfo[],
  isArray: boolean,
  optional: boolean,
  hasReference: boolean, // it will be true if the type is interface or class
  nestedProperties: ITypeDocs[]
}

export type ComponentsTypesDocs = {[name: string]: MethodsTypesDocs}; // {component name}_{component type} => methods types

export type MethodsTypesDocs = {[name: string]: IMethodTypeDocs}; // method name => method return type & arguments types

export interface IMethodTypeDocs {
  returnType?: ITypeDocs;
  argumentsTypes?: {[name: string]: IMethodArgumentTypeDocs};
}

export interface IMethodArgumentTypeDocs {
  decorators?: string[];
  type: ITypeDocs;
}

export interface IRunOptions {
  state?: AppState; // the default state is JS
  rootPath?: string; // the project root directory path which have the tsconfig.json file
}
