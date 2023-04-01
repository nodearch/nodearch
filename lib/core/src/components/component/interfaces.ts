import { ClassConstructor } from '../../utils.index.js';

export interface IUseDecoratorOptions<T = any> {
  component: ClassConstructor;
  options?: T;
}