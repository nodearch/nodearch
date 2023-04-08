import { Container } from '../container/container.js';
import { ComponentScope } from './enums.js';
import { ComponentInfo } from './component-info.js';

export class ComponentHandler {
  constructor(private readonly container: Container) {}

  // register(componentInfo: ComponentInfo) {
  //   switch (componentInfo.options?.scope) {
  //     case ComponentScope.SINGLETON:
  //       this.container.bindComponent(componentInfo, ComponentScope.SINGLETON);
  //       break;
  //     case ComponentScope.TRANSIENT:
  //       this.container.bindComponent(componentInfo, ComponentScope.TRANSIENT);
  //       break;
  //     case ComponentScope.REQUEST:
  //       this.container.bindComponent(componentInfo, ComponentScope.REQUEST);
  //       break;
  //     default: // will use the container default scope
  //       this.container.bindComponent(componentInfo);
  //   }

  //   if (componentInfo.id) {
  //     this.container.addToComponentGroup(componentInfo.getClass(), componentInfo.id);
  //   }

  //   if (componentInfo.options?.namespace && componentInfo.options.namespace !== componentInfo.id) {
  //     this.container.addToNamespace(componentInfo.getClass(), componentInfo.options.namespace);
  //   }
  // }

  registerExtension(componentInfo: ComponentInfo) {
    // Bind extension component instance into the app DI container
    this.container.bindDynamic(componentInfo.getClass(), () => {
      // This will return an instance from the extension DI container 
      return componentInfo.getInstance();
    });

    if (componentInfo.id) {
      this.container.addToComponentGroup(componentInfo.getClass(), componentInfo.id);
    }

    if (componentInfo.options?.namespace && componentInfo.options.namespace !== componentInfo.id) {
      this.container.addToNamespace(componentInfo.getClass(), componentInfo.options.namespace);
    }
  }
}