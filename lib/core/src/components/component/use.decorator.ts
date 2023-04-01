import { ClassConstructor, ClassMethodDecorator } from '../../utils/types.js';
import { classMethodDecorator, isComponent } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';
import { IUseDecoratorOptions } from './interfaces.js';


export function Use(component: ClassConstructor): ClassMethodDecorator;
export function Use<T>(component: ClassConstructor<T>, options: T): ClassMethodDecorator;
export function Use(component: ClassConstructor, options?: any): ClassMethodDecorator {
  return classMethodDecorator<IUseDecoratorOptions>({ 
    id: CoreDecorator.USE, 
    fn: (target, propKey) => {

      if (!isComponent(component)) {
        const controllerMethodName = `(${target.constructor.name}${propKey ? `.${propKey.toString()}` : ''})`;
        throw new Error(`Calling @Use(${component.name}) on ${controllerMethodName}. ${component.name} is not a component.`);
      }

      return { 
        component, 
        options,
      };
    }
  });
}