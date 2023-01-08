import { ClassConstructor } from '../../utils/types.js';
import { ComponentHandler } from '../handler.js';
import { IComponentDecoratorDependency, IComponentOptions } from '../interfaces.js';


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