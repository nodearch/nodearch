import { Container } from '../container/container.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentBinder } from './component-binder.js';
import { ComponentInfo } from './component-info.js';
import { IGetComponentsOptions, IGetDecoratorsOptions } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';

/**
 * The ComponentRegistry class manages the registration and retrieval of components within an application.
 * It provides methods for registering components, retrieving comprehensive information about components,
 * and filtering components based on specific criteria.
 */
export class ComponentRegistry {
  
  private container: Container;
  private registeredComponents: ComponentInfo[];
  private componentBinder: ComponentBinder;

  constructor(container: Container) {
    this.container = container;
    this.registeredComponents = [];
    this.componentBinder = new ComponentBinder(container);
  }

  /**
   * Retrieves a list of ComponentInfo objects that contain comprehensive information about component classes, instances,
   * methods, decorators, and more. The returned list can be optionally filtered by the provided component id or decorator ID(s).
   * @param options An object containing options for filtering the list of components.
   * @returns An array of ComponentInfo objects.
   */
  get<T = any>(options?: IGetComponentsOptions): ComponentInfo<T>[] {

    let components = this.getComponents(options?.id);

    if (options?.decoratorIds) {
      components = this.filterComponentsByDecoratorIds(components, options.decoratorIds);
    }

    return components;
  }

  /**
   * Returns decorators info from all components filtered by the passed options
   * @param id Decorator ID
   */
  getDecorators<T = any>(options: IGetDecoratorsOptions = {}) {
    return this.getComponents()
      .map(comp => {
        return comp.getDecorators<T>(options)
          .map(decoInfo => {
            return {
              ...decoInfo,
              componentInfo: comp
            };
          })
      })
      .flat(1);
  }

  /**
   * Retrieves the list of exported ComponentInfo objects from the app.
   * @returns An array of ComponentInfo objects.
   */
  getExported() {
    return this.registeredComponents.filter(comp => comp.isExported);
  }

  /**
   * Register app components from a given classes list
   */
  register(classes: ClassConstructor[]) {
    classes.forEach(classConstructor => {
      const registration = ComponentMetadata.getComponentRegistration(classConstructor);

      if (!registration) return;

      const componentInfo = new ComponentInfo(classConstructor, registration, this.container);

      this.componentBinder.bindComponent(componentInfo);

      this.registeredComponents.push(componentInfo);
    });
  }

  /**
   * Register the exported components from the extensions 
   */
  registerExtension(componentRegistry: ComponentRegistry, extContainer: Container) {
    componentRegistry.getExported().forEach(componentInfo => {
      this.registeredComponents.push(componentInfo);

      this.componentBinder.bindExtensionComponent(componentInfo, extContainer);
    });
  }

  private getComponents(id?: string) {
    let components: ComponentInfo[] = [];

    if (id) {
      components = [...this.registeredComponents.filter(comp => comp.getId() === id)];
    }
    else {
      components = [...this.registeredComponents];
    }

    return components;
  }

  private filterComponentsByDecoratorIds(components: ComponentInfo[], decoratorIds: string[]) {
    return components.filter(comp => {
      return comp.getDecoratorsIds().some(
        decoId => decoratorIds.includes(decoId)
      );
    });
  }
}