import { ClassConstructor, ClassMethodDecorator } from '../../utils/types.js';
import { classMethodDecorator, isComponent } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';


export function Use(component: ClassConstructor): ClassMethodDecorator;
export function Use<T>(component: ClassConstructor<T>, options: T): ClassMethodDecorator;
export function Use(component: ClassConstructor, options?: any): ClassMethodDecorator {
  return classMethodDecorator({ 
    id: CoreDecorator.USE, 
    fn: (target, propKey) => {

      if (!isComponent(component)) {
        throw new Error(`Component ${component.name} passed to (${target}${propKey ? `.${propKey.toString()}` : ''}) is not a registered component`);
      }

      return { 
        component, 
        options 
      };
    }
  });
}