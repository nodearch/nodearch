import { isAsyncFunction } from 'node:util/types';
import { IBinderBindOptions } from './interfaces.js';
import { ComponentInfo } from './component-info.js';
import { Container } from '../container/container.js';

export class ComponentBinder {
  
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  bindComponent(componentInfo: ComponentInfo) {

    this.container.bindComponent({
      componentClass: componentInfo.getClass(),
      id: componentInfo.getId(),
      namespace: componentInfo.getOptions().namespace,
      scope: componentInfo.getOptions().scope
    })

    // .proxy({
    //   get: function(target: any, propKey: string) {
    //     const originalMethod = target[propKey];

    //     if (typeof originalMethod === 'function' && propKey !== 'constructor') {
    //       if (isAsyncFunction(originalMethod)) {
    //         return async function (...args: any) {
    //           let result, state = true;
  
    //           if (state) {
    //             result = await originalMethod.apply(target, args);
    //           }
  
    //           return result;
    //         }
    //       }
    //       else {
    //         return function (...args: any) {
    //           let result, state = true;
  
    //           if (state) {
    //             result = originalMethod.apply(target, args);
    //           }
  
    //           return result;
    //         }
    //       }
    //     }
    //     else {
    //       return originalMethod;
    //     }
    //   }
    // });

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
}