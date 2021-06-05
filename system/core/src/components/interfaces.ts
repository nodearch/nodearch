import { Container } from 'inversify';
import ts from 'typescript';
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

export interface ITypeDocs {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  returnType?: string;
  tags: ts.JSDocTagInfo[],
  isArray: boolean,
  optional: boolean,
  hasReference: true,
  nestedType: ITypeDocs[]
}

export type MethodsTypeDocs = Map<string, IMethodTypeDocs>;

export interface IMethodTypeDocs {
  returnType?: ITypeDocs;
  argumentsTypes?: Map<string, IMethodArgumentTypeDocs>; 
}

export interface IMethodArgumentTypeDocs {
  decorator?: string;
  type: ITypeDocs;
}

