import { isAsyncFunction } from 'node:util/types';
import { IBinderBindOptions, IComponentDecorator } from './interfaces.js';
import { ComponentInfo } from './component-info.js';
import { Container } from '../container/container.js';
import { IBindActivationContext, IBindActivationHandler } from '../container/interfaces.js';
import { CoreDecorator, DecoratorType } from './enums.js';
import { IInterceptor } from '../index.js';

export class ComponentBinder {
  
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  // TODO: move most of the code to interceptor folder. This will only be registering the activation handler if interceptors were found.
  bindComponent(componentInfo: ComponentInfo) {

    const activationHandlers: IBindActivationHandler<IInterceptor>[] = [];

    const interceptorDecorators = componentInfo.getDecorators({
      useId: CoreDecorator.INTERCEPTOR
    });

    console.log('interceptorDecorators', interceptorDecorators);

    if (interceptorDecorators.length) {
      const interceptorHandler = (context: IBindActivationContext, instance: IInterceptor) => {

        const proxy = {
          get: (target: any, propKey: string) => {
            const originalMethod = target[propKey];

            if (typeof originalMethod === 'function' && propKey !== 'constructor') {

              const interceptors = this.getInterceptorInstanceByMethod(interceptorDecorators, propKey, instance);

              if (isAsyncFunction(originalMethod)) {
                return async function (...args: any) {
                  let result, state = true;
      

                  if (propKey === interceptorDecorators[0].method) {
                    // state = interceptorInstance.before();
                  }

                  if (state) {
                    result = await originalMethod.apply(target, args);
                  }
      
                  if (!state) {
                    throw new Error('Interceptor error');
                  }
                  else {
                    return result;
                  }
                }
              }
              else {
                return function (...args: any) {
                  let result, state = true;
      
                  if (propKey === interceptorDecorators[0].method) {
                    state = interceptors.every(interceptorInstance => interceptorInstance.before ? interceptorInstance.before() : true);
                  }

                  if (state) {
                    result = originalMethod.apply(target, args);
                  }
      
                  if (!state) {
                    // throw new Error(`Unhandled Interceptor Error - @${interceptorInstance.constructor.name} on ${componentInfo.getName()}.${propKey}`);
                  }
                  else {
                    return result;
                  }
                }
              }
            }
            else {
              return originalMethod;
            }
          }
        };
        
        
        return new Proxy(instance, proxy);
      };

      activationHandlers.push(interceptorHandler);
    }

    this.container.bindComponent({
      componentClass: componentInfo.getClass(),
      id: componentInfo.getId(),
      namespace: componentInfo.getOptions().namespace,
      scope: componentInfo.getOptions().scope,
      onActivation: activationHandlers
    })
  }

  bindExtensionComponent(componentInfo: ComponentInfo, extContainer: Container) {
    this.container.bindExtensionComponent(
      {
        componentClass: componentInfo.getClass(),
        id: componentInfo.getId(),
        namespace: componentInfo.getOptions().namespace,
        scope: componentInfo.getOptions().scope
      },
      extContainer
    );
  }

  private getInterceptorInstanceByMethod(interceptorDecorators: IComponentDecorator<any>[], method: string, instance: IInterceptor) {
    const decorators = interceptorDecorators.filter(decorator => !decorator.method || decorator.method === method);
  
    return decorators.map(decorator => {
      const key = decorator.dependencies[0].key;
      const interceptorInstance = (instance as any)[key];
  
      return interceptorInstance as IInterceptor;
    })
  }
}