import { isAsyncFunction } from 'node:util/types';
import { IComponentDecorator } from './interfaces.js';
import { ComponentInfo } from './component-info.js';
import { Container } from '../container/container.js';
import { IBindActivationContext, IBindActivationHandler } from '../container/interfaces.js';
import { CoreDecorator } from './enums.js';
import { IInterceptor } from '../index.js';

export class ComponentBinder {

  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  bindComponent(componentInfo: ComponentInfo) {

    const activationHandlers: IBindActivationHandler<IInterceptor>[] = [];

    const interceptorDecorators = componentInfo.getDecorators({
      useId: CoreDecorator.INTERCEPTOR
    });

    if (interceptorDecorators.length) {
      activationHandlers.push(this.getInterceptorHandler(interceptorDecorators));
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

  // Get a component proxy (interceptor handler)
  private getInterceptorHandler(interceptorDecorators: IComponentDecorator[]) {
    return (context: IBindActivationContext, instance: IInterceptor) => {
      const proxy = {
        get: (target: any, propKey: string) => {
          // Keep a reference to the original method
          const originalMethod = target[propKey];

          // Make sure the method we'll proxy is a function and not the constructor
          if (typeof originalMethod !== 'function' || propKey === 'constructor') return originalMethod;

          // Get the interceptors' instances for the current method
          const interceptors = this.getMethodInterceptors(interceptorDecorators, propKey, instance);

          // If there are no interceptors, return the original method
          if (!interceptors.length) return originalMethod;

          // If the original method is async, return an async function
          if (isAsyncFunction(originalMethod)) {
            return async function (...args: any) {
              let result;

              for (const interceptorInstance of interceptors) {
                interceptorInstance.before ? await interceptorInstance.before() : true;
              }

              result = await originalMethod.apply(target, args);

              for (const interceptorInstance of interceptors) {
                interceptorInstance.after ? await interceptorInstance.after() : true;
              }

              return result;
            }
          }
          // If the original method is not async, return a sync function
          else {
            return function (...args: any) {
              let result;

              for (const interceptorInstance of interceptors) {
                interceptorInstance.before ? interceptorInstance.before() : true;
              }

              result = originalMethod.apply(target, args);

              for (const interceptorInstance of interceptors) {
                interceptorInstance.after ? interceptorInstance.after() : true;
              }

              return result;
            }
          }
        }
      };

      return new Proxy(instance, proxy);
    };
  }

  // Return a list of interceptors' instances for a given method
  private getMethodInterceptors(interceptorDecorators: IComponentDecorator<any>[], method: string, instance: IInterceptor) {
    const decorators = interceptorDecorators.filter(decorator => !decorator.method || decorator.method === method);

    return decorators.map(decorator => {
      const key = decorator.dependencies[0].key;
      const interceptorInstance = (instance as any)[key];

      return interceptorInstance as IInterceptor;
    })
  }
}