import { Container } from 'inversify';
import { ClassConstructor } from '../../utils';
import { ComponentHandler } from '../base';
import { IComponentHandler } from '../interfaces';
import { ComponentInfo } from './info';
import { IComponentRegistration } from './interfaces';
import { ComponentMetadata } from './metadata';


export class ComponentRegistry {
  // Dependency injection container that holds all the app components 
  private container: Container;
  // A map of registries for all components types within the app
  private registryMap: Map<string, { components: ComponentInfo[], handler: IComponentHandler }>;
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

  getExported() {
    return this.exported;
  }

  /**
   * Register app components from a given classes list
   */
  register(classes: ClassConstructor[]) {    
    classes.forEach(classConstructor => {
      const registration = ComponentMetadata.getComponentRegistration(classConstructor);

      if (!registration || !this.canRegister(registration)) return;

      const componentInfo = new ComponentInfo(classConstructor, registration, this.container);

      const registry = this.getComponentRegistry(registration);

      registry.components.push(componentInfo);

      // TODO: reflect the changes on register function
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
   * Register the exported components from all extensions 
   */
  registerExtensions(componentRegistries: ComponentRegistry[]) {
    componentRegistries.forEach(compRegistry => {
      const exported = compRegistry.getExported();
      
      exported.forEach(componentInfo => {
        const registry = this.getComponentRegistry(componentInfo.getRegistration());
        registry.handler.registerExtension?.(componentInfo);
      });
    
    });
  }

  private canRegister(registration: IComponentRegistration) {
    // TODO: support include/exclude
    return true;
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