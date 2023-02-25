import { Container } from '../app/container.js';
import { ComponentScope } from './enums.js';
import { ComponentInfo } from './info.js';

export class ComponentHandler {
  constructor(private readonly container: Container) {}

  register(componentInfo: ComponentInfo) {
    switch (componentInfo.options?.scope) {
      case ComponentScope.Singleton:
        this.container.bindToSelf(componentInfo.getClass(), ComponentScope.Singleton);
        break;
      case ComponentScope.Transient:
        this.container.bindToSelf(componentInfo.getClass(), ComponentScope.Transient);
        break;
      case ComponentScope.Request:
        this.container.bindToSelf(componentInfo.getClass(), ComponentScope.Request);
        break;
      default: // will use the container default scope
        this.container.bindToSelf(componentInfo.getClass());
    }

    if (componentInfo.id) {
      this.container.addToComponentGroup(componentInfo.getClass(), componentInfo.id);
    }

    if (componentInfo.options?.namespace && componentInfo.options.namespace !== componentInfo.id) {
      this.container.addToNamespace(componentInfo.getClass(), componentInfo.options.namespace);
    }
  }

  registerExtension(componentInfo: ComponentInfo) {
    // Bind extension component instance into the app DI container
    this.container.bindToDynamic(componentInfo.getClass(), () => {
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