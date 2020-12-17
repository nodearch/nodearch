import {IBindComponentOptions, IBindExtComponentOptions} from "./interfaces";
import {ComponentScope} from "./enums";
import {Container, interfaces} from "inversify";

export abstract class BaseComponentHandler {
  constructor(protected readonly container: Container) {}

  protected bindComponent(options: IBindComponentOptions): interfaces.BindingWhenOnSyntax<any> {
    let binding: interfaces.BindingWhenOnSyntax<any>;

    switch (options.componentInfo.scope) {
      case ComponentScope.Singleton:
        binding = this.container.bind(options.component).toSelf().inSingletonScope();
        break;
      case ComponentScope.Transient:
        binding = this.container.bind(options.component).toSelf().inTransientScope();
        break;
      case ComponentScope.Request:
        binding = this.container.bind(options.component).toSelf().inRequestScope();
        break;
      default: // will use the container default scope
        binding = this.container.bind(options.component).toSelf();
    }

    if (options.type) {
      this.container.bind(options.type).toService(options.component);
    }

    if (options.id && options.id !== options.type) {
      this.container.bind(options.id).toService(options.component);
    }

    return binding;
  }

  protected bindExtComponent(options: IBindExtComponentOptions) {
    this.container.bind(options.component).toDynamicValue(() => {
      return options.extContainer.get(options.component);
    });

    if (options.type) {
      this.container.bind(options.type).toService(options.component);
    }

    if (options.id && options.id !== options.type) {
      this.container.bind(options.id).toService(options.component);
    }
  }
}