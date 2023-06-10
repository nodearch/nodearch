import { ClassMethodDecorator } from '../../utils/types.js';
import { ComponentFactory } from '../component-factory.js';
import { CoreDecorator } from '../enums.js';
import { IUseDecoratorOptions, IUseProviderClass } from './interfaces.js';


export function Use(component: IUseProviderClass): ClassMethodDecorator;
export function Use<T>(component: IUseProviderClass<T>, options: T): ClassMethodDecorator;
export function Use(component: IUseProviderClass, options?: any): ClassMethodDecorator {
  return ComponentFactory.classMethodDecorator<IUseDecoratorOptions>({ 
    id: CoreDecorator.USE, 
    fn: (target, propKey) => {

      if (!ComponentFactory.isComponent(component)) {
        const controllerMethodName = `(${target.constructor.name}${propKey ? `.${propKey.toString()}` : ''})`;
        throw new Error(`Calling @Use(${component.name}) on ${controllerMethodName}. ${component.name} is not a component.`);
      }

      return { 
        component, 
        options,
      };
    },
    dependencies: [component]
  });
}