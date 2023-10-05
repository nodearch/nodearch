import { ClassConstructor } from '../../utils.index.js';

export interface IUseDecoratorOptions<T = any> {
  component: ClassConstructor;
  options?: T;
}

export type IUseProvider<A = undefined, O = undefined> = { handler: (data: {args: A, options: O}) => Promise<void>; };

export type IUseProviderClass<T = undefined> = ClassConstructor<IUseProvider<any, T>>;