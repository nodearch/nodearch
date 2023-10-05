import inversify, { interfaces } from 'inversify';
import { DependencyException } from '../errors.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentScope } from '../components/enums.js';
import { IBindActivationHandler, IBindComponentOptions, IBindDeactivationHandler } from './interfaces.js';


/**
 * Components' DI Container.
 * An abstraction over the inversify container.
 */


export class Container {
  
  private inversifyContainer: inversify.Container;

  constructor(inversifyContainer: inversify.Container) {
    this.inversifyContainer = inversifyContainer;
  }

  // Bind a component to an object
  bindConstant<T>(componentClass: ClassConstructor<T>, value: T) {
    this.inversifyContainer.bind(componentClass).toConstantValue(value);
  }

  // Bind a component to a dynamic value that can changed with every call to the function
  bindDynamic<T>(componentClass: ClassConstructor<T>, value: () => T) {
    this.inversifyContainer.bind(componentClass).toDynamicValue(value);
  }

  // Bind a component to itself (the component class) with a scope
  bindComponent<T>(options: IBindComponentOptions<T>) {
    // Bind the component to the inversify container
    const binding = this.bindClass(
        options.componentClass, 
        options.scope
      );

    // Register the activation hooks.

    if (options.onActivation) {
      options.onActivation.forEach(handler => {
        binding.onActivation(this.activationHandlerWrap(handler));
      });
    }

    if (options.onDeactivation) {
      options.onDeactivation.forEach(handler => {
        binding.onDeactivation(this.deactivationHandlerWrap(handler));
      });
    }

    this.bindIdToComponent(options.componentClass, options.id);

    if (options.namespace) {
      this.bindNamespacesToComponent(options.componentClass, options.namespace);
    }
  }

  // Bind exported component from an extension to the parent container
  bindExtensionComponent<T>(options: IBindComponentOptions<T>, extContainer: Container) {
    this.bindDynamic(options.componentClass, () => {
      return extContainer.get(options.componentClass);
    });

    this.bindIdToComponent(options.componentClass, options.id);

    if (options.namespace) {
      this.bindNamespacesToComponent(options.componentClass, options.namespace);
    }
  }

  // Get all components' instances in a container namespace
  getByNamespace<T>(namespace: string) {
    return this.getAll<T>(this.getNamespaceId(namespace));
  }

  // Get all components' instances in a component group
  getById<T>(id: string) {
    return this.getAll<T>(this.getComponentGroupId(id));
  }

  // Get a component instance from the container
  get<T>(component: ClassConstructor<T>): T | undefined {
    try {
      return this.inversifyContainer.get<T>(component);
    }
    catch (e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${component}`) {
        throw new DependencyException(e.message);
      }
    }
  }

  // Override the value of a bound component in the container, similar to bindToConstant
  override<T>(component: ClassConstructor<T>, value: T) {
    this.inversifyContainer.rebind(component).toConstantValue(value);
  }

  // Take a container snapshot
  snapshot() {
    this.inversifyContainer.snapshot();
  }

  // Restore the last container snapshot
  restore() {
    this.inversifyContainer.restore();
  }

  // Clear the cache of all components in the container
  clearCache() {
    const compsMap = (<Map<any, any[]>>(<any>this.inversifyContainer)._bindingDictionary._map);

    compsMap.forEach(comps => {
      comps.forEach(comp => {
        if (comp.type === 'Instance') {
          comp.cache = null;
          comp.activated = false;
        }
      });
    });
  }

  // Create a clone of the current container
  clone() {
    const inversifyContainer = inversify.Container.merge(
      this.inversifyContainer, 
      new inversify.Container()
    ) as inversify.Container;

    return new Container(inversifyContainer);
  }

  private bindClass(componentClass: ClassConstructor, scope?: ComponentScope) {
    let binding: inversify.interfaces.BindingWhenOnSyntax<any>;

    if (scope === ComponentScope.SINGLETON) {
      binding = this.inversifyContainer.bind(componentClass).toSelf().inSingletonScope();
    }
    else if (scope === ComponentScope.TRANSIENT) {
      binding = this.inversifyContainer.bind(componentClass).toSelf().inTransientScope();
    }
    else if (scope === ComponentScope.REQUEST) {
      binding = this.inversifyContainer.bind(componentClass).toSelf().inRequestScope();
    }
    else {
      binding = this.inversifyContainer.bind(componentClass).toSelf();
    }

    return binding;
  }

  private bindIdToComponent(componentClass: ClassConstructor, id: string) {
    this.inversifyContainer.bind(this.getComponentGroupId(id)).toService(componentClass);
  }

  private bindNamespacesToComponent(componentClass: ClassConstructor, namespaces: string | string[]) {
    namespaces = namespaces ? (Array.isArray(namespaces) ? namespaces : [namespaces]) : [];

    namespaces.forEach(ns => {
      this.inversifyContainer.bind(this.getNamespaceId(ns)).toService(componentClass);
    });
  }

  // We'll need to pass a custom context to the activation handler.
  private activationHandlerWrap<T>(handler: IBindActivationHandler<T>) {
    return (context: interfaces.Context, instance: T) => {
      // TODO: pass custom context
      return handler({}, instance);
    };
  }

  // It doesn't do much, but it's here just in case inversify API changes.
  private deactivationHandlerWrap<T>(handler: IBindDeactivationHandler<T>) {
    return (instance: T) => {
      handler(instance);
    };
  }

  private getAll<T>(id: string) {
    let instances: T[] = [];

    try {
      instances = this.inversifyContainer.getAll<T>(id);
    }
    catch (e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${id}`) {
        throw new DependencyException(e.message);
      }
    }

    return instances;
  }

  private getNamespaceId(namespace: string) {
    return 'namespace:' + namespace;
  }

  private getComponentGroupId(componentId: string) {
    return 'component-group:' + componentId;
  }
}