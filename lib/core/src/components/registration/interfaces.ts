import { ClassConstructor } from '../../utils';
import { ComponentHandler } from '../handler';
import { IComponentDecoratorDependency, IComponentOptions } from '../interfaces';


export interface IComponentRegistration<T = any> {
  id: string;
  handler?: ClassConstructor<ComponentHandler>;
  options?: IComponentOptions;
  data?: T;
  /**
   * Information about all registered dependencies (components)
   * added by this decorator instance. Use the key to find the instance 
   * of your dependency on the target (the component this decorator is placed on)
   */
  dependencies?: IComponentDecoratorDependency[];
}