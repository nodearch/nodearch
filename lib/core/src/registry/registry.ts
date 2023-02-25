import { Container } from '../app/container.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentHandler } from './handler.js';
import { ComponentInfo } from './info.js';
import { IComponentRegistration } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';


export class ComponentRegistry {
  // Dependency injection container that holds all the app components 
  private container: Container;
  // A map of registries for all components types within the app
  private registryMap: Map<string, { components: ComponentInfo[], handler: ComponentHandler }>;
  // Keeps track of all the exported components from the app
  private exported: ComponentInfo[];
  // Keeps track of all hooks within the app
  private hooks: ComponentInfo[];

  constructor(container: Container) {
    this.container = container;
    this.registryMap = new Map();
    this.exported = [];
    this.hooks = [];
  }

  /**
   * Returns a list of ComponentInfo, which includes all 
   * information about the component class, instance, 
   * methods, decorators, etc. The returned list contains
   * only the components that this app exports
   * @returns ComponentInfo[]
   */
  getExported() {
    return this.exported;
  }

  /**
   * Returns a list of ComponentInfo, which includes all 
   * information about the component class, instance, 
   * methods, decorators, etc. The returned list is 
   * flittered by the id parameter.
   * @param id Component ID, you can also pass a CoreAnnotation value 
   * @returns ComponentInfo[]
   */
  getComponents<T = any>(id: string) {
    let components: ComponentInfo<T>[] = []; 
    
    const registry = this.registryMap.get(id);
    
    if (registry && registry.components.length) {
      components = registry.components as ComponentInfo<T>[];
    }

    return components;
  }

  /**
   * Register app components from a given classes list
   */
  register(classes: ClassConstructor[]) {    
    classes.forEach(classConstructor => {
      const registration = ComponentMetadata.getComponentRegistration(classConstructor);

      if (!registration) return;

      const componentInfo = new ComponentInfo(classConstructor, registration, this.container);

      const registry = this.getComponentRegistry(registration);

      registry.components.push(componentInfo);

      registry.handler.register(componentInfo);

      if (componentInfo.isExported) {
        this.exported.push(componentInfo);
      }

      if (componentInfo.isHook) {
        this.hooks.push(componentInfo);
      }
    });
  } 

  /**
   * Register the exported components from the extensions 
   */
  registerExtensions(components: ComponentInfo[]) {
    components.forEach(componentInfo => {
      const registry = this.getComponentRegistry(componentInfo.getRegistration());
      registry.components.push(componentInfo);
      registry.handler.registerExtension?.(componentInfo);
    });
  }

  /**
   * Returns the Registry for a given component type by it's registration id.
   * It'll also create and then return the registry if not found.
   */
  private getComponentRegistry(registration: IComponentRegistration) {
    let registry = this.registryMap.get(registration.id);

    if (!registry) {
      registry = {
        components: [],
        handler: new (registration.handler || ComponentHandler)(this.container)
      };
      this.registryMap.set(registration.id, registry);
    }

    return registry;
  }

}