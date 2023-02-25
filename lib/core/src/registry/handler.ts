import { Container, interfaces } from "inversify";
import { ComponentScope } from './enums.js';
import { ComponentInfo } from './info.js';

export class ComponentHandler {
  constructor(private readonly container: Container) {}

  register(componentInfo: ComponentInfo) {
    let binding: interfaces.BindingWhenOnSyntax<any>;

    switch (componentInfo.options?.scope) {
      case ComponentScope.Singleton:
        binding = this.container.bind(componentInfo.getClass()).toSelf().inSingletonScope();
        break;
      case ComponentScope.Transient:
        binding = this.container.bind(componentInfo.getClass()).toSelf().inTransientScope();
        break;
      case ComponentScope.Request:
        binding = this.container.bind(componentInfo.getClass()).toSelf().inRequestScope();
        break;
      default: // will use the container default scope
        binding = this.container.bind(componentInfo.getClass()).toSelf();
    }

    if (componentInfo.id) {
      this.container.bind(componentInfo.id).toService(componentInfo.getClass());
    }

    if (componentInfo.options?.namespace && componentInfo.options.namespace !== componentInfo.id) {
      this.container.bind(componentInfo.options.namespace).toService(componentInfo.getClass());
    }

    return binding;
  }

  registerExtension(componentInfo: ComponentInfo) {
    // Bind extension component instance into the app DI container
    const binding = this.container.bind(componentInfo.getClass()).toDynamicValue(() => {
      // This will return an instance from the extension DI container 
      return componentInfo.getInstance();
    });

    if (componentInfo.id) {
      this.container.bind(componentInfo.id).toService(componentInfo.getClass());
    }

    if (componentInfo.options?.namespace && componentInfo.options.namespace !== componentInfo.id) {
      this.container.bind(componentInfo.options.namespace).toService(componentInfo.getClass());
    }

    return binding;
  }
}