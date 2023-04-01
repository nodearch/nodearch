import inversify from 'inversify';
import { DependencyException } from '../errors.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentScope } from '../components/enums.js';


export class Container {
  
  private inversifyContainer: inversify.Container;

  constructor(inversifyContainer: inversify.Container) {
    this.inversifyContainer = inversifyContainer;
  }

  // Bind a component to an object
  bindToConstant<T>(component: ClassConstructor<T>, value: T) {
    this.inversifyContainer.bind(component).toConstantValue(value);
  }

  // Bind a component to a dynamic value that can changed with every call to the function
  bindToDynamic<T>(component: ClassConstructor<T>, value: () => T) {
    this.inversifyContainer.bind(component).toDynamicValue(value);
  }

  // Bind a component to itself (the component class) with a scope
  bindToSelf<T>(component: ClassConstructor<T>, scope?: ComponentScope) {
    if (scope === ComponentScope.SINGLETON) {
      this.inversifyContainer.bind(component).toSelf().inSingletonScope();
    }
    else if (scope === ComponentScope.TRANSIENT) {
      this.inversifyContainer.bind(component).toSelf().inTransientScope();
    }
    else if (scope === ComponentScope.REQUEST) {
      this.inversifyContainer.bind(component).toSelf().inRequestScope();
    }
    else {
      this.inversifyContainer.bind(component).toSelf();
    }
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