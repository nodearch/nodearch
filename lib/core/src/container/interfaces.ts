import { ComponentScope } from '../components/enums.js';
import { ClassConstructor } from '../utils/types.js';


export interface IBindComponentOptions<T> {
  componentClass: ClassConstructor<T>;
  id: string;
  namespace?: string | string[];
  scope?: ComponentScope;
  onActivation?: IBindActivationHandler<T>[];
  onDeactivation?: IBindDeactivationHandler<T>[];
}

export type IBindActivationHandler<T> = (context: IBindActivationContext, instance: T) => T;

export type IBindDeactivationHandler<T> = (instance: T) => T;

export interface IBindActivationContext {}