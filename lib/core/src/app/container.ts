import inversify from 'inversify';
import { DependencyException } from '../errors.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentScope } from '../components/enums.js';
import { ComponentInfo } from '../components/component-info.js';
import { ProxyFactory } from '../utils/proxy-factory.js';


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
  bindComponent(componentClass: ClassConstructor, scope?: ComponentScope) {
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

    return {
      proxy: this.proxyComponent(binding)
    };
  }

  // Add a bound component to a container namespace
  addToNamespace(component: ClassConstructor, namespace: string) {
    this.addToGroup('namespace', namespace, component);
  }

  // Get all components' instances in a container namespace
  getNamespace<T>(namespace: string) {
    return this.getGroup<T>('namespace', namespace);
  }

  // Add a bound component to a component group
  addToComponentGroup(component: ClassConstructor, group: string) {
    this.addToGroup('component-group', group, component);
  }

  // Get all components' instances in a component group
  getComponentGroup<T>(group: string) {
    return this.getGroup<T>('component-group', group);
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

  private proxyComponent(binding: inversify.interfaces.BindingWhenOnSyntax<any>) {
    /**
     * Proxy a component instance
     */
    return (proxyHandler: ProxyHandler<any>) => {
      binding.onActivation((context, instance) => {
        return new Proxy(instance, proxyHandler);
      });
    };
  }

  private addToGroup(groupPrefix: string, group: string, component: ClassConstructor) {
    this.inversifyContainer.bind(groupPrefix + ':' + group).toService(component);
  }

  private getGroup<T>(groupPrefix: string, group: string) {
    const groupName = groupPrefix + ':' + group;

    let instances: T[] = [];

    try {
      instances = this.inversifyContainer.getAll<T>(groupName);
    }
    catch (e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${groupName}`) {
        throw new DependencyException(e.message);
      }
    }

    return instances;
  }
}