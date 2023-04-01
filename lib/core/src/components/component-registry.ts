import { Container } from '../app/container.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentHandler } from './component-handler.js';
import { ComponentInfo } from './component-info.js';
import { IUseDecoratorOptions } from './component/interfaces.js';
import { isComponent } from './decorator-factory.js';
import { CoreDecorator } from './enums.js';
import { IComponentRegistration, IGetComponentsOptions } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';


export class ComponentRegistry {
  // Dependency injection container that holds all the app components 
  private container: Container;
  // A map for the handlers of all components types within the app
  private HandlerMap: Map<string, ComponentHandler>;
  // A map componentInfo sets, each set is flittered by a decorator id
  private componentInfoMap: Map<string, Set<ComponentInfo>>;
  // Keeps track of all the exported components from the app
  private exported: ComponentInfo[];
  // Keeps track of all hooks within the app
  private hooks: ComponentInfo[];

  constructor(container: Container) {
    this.container = container;
    this.HandlerMap = new Map();
    this.componentInfoMap = new Map();
    this.exported = [];
    this.hooks = [];
  }

  /**
   * Returns a list of ComponentInfo, which includes all 
   * information about the component class, instance, 
   * methods, decorators, etc. The returned list is 
   * flittered by the passed decorator id.
   * @param options Options to filter the returned list
   * @returns ComponentInfo[]
   */
  get<T = any>(options?: IGetComponentsOptions): ComponentInfo<T>[] {

    let components = this.getComponents(options?.id);

    if (options?.decoratorIds) {
      components = this.filterComponentsByDecoratorIds(components, options.decoratorIds);
    }

    return components;
  }

  /**
   * Returns a list of decorators info for a given decorator id
   * @param id Decorator ID
   */
  getDecoratorsById<T = any>(id: string) {
    return this.getComponents(id)
      .map(comp => {
        return comp.getDecoratorsById<T>(id)
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
   * Get a list of decorators info of type @Use()
   * @param id id of the component passed to @Use()
   */
  getUseDecorators<T>(id: string) {
    return this.getDecoratorsById<IUseDecoratorOptions<T>>(CoreDecorator.USE)
      .filter(decoInfo => isComponent(decoInfo.data.component, id));
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
   * Register app components from a given classes list
   */
  register(classes: ClassConstructor[]) {    
    classes.forEach(classConstructor => {
      const registration = ComponentMetadata.getComponentRegistration(classConstructor);

      if (!registration) return;

      const componentInfo = new ComponentInfo(classConstructor, registration, this.container);

      // Add to the decorators map
      componentInfo.getDecoratorsIds().forEach(
        decoId => this.getComponentInfoSet(decoId).add(componentInfo)
      );

      this.getHandler(registration)
        .register(componentInfo);

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

      // Add to the decorators map
      componentInfo.getDecoratorsIds().forEach(deco =>
        this.getComponentInfoSet(deco).add(componentInfo)
      );

      this.getHandler(componentInfo.getRegistration())
        .registerExtension?.(componentInfo);
    });
  }

  /**
   * Returns all available ComponentInfo
   * @returns ComponentInfo[]
   */
  private getAll<T = any>() {
    const set = new Set<ComponentInfo<T>>();
    this.componentInfoMap.forEach(comps => comps.forEach(comp => set.add(comp)));
    return Array.from(set);
  }

  /**
   * Returns the componentInfo set for a given decorator id
   * It'll also create and then return the set if not found.
   */
  private getComponentInfoSet(decoId: string) {
    let componentInfoSet = this.componentInfoMap.get(decoId);

    if (!componentInfoSet) {
      componentInfoSet = new Set<ComponentInfo>;
      this.componentInfoMap.set(decoId, componentInfoSet);
    }

    return componentInfoSet;
  }

  /**
   * Returns the handler for a given component type by the component registration info.
   * It'll also create and then return the handler if not found.
   */
  private getHandler(registration: IComponentRegistration) {
    let handler = this.HandlerMap.get(registration.id);

    if (!handler) {
      handler = new (registration.handler || ComponentHandler)(this.container);
      this.HandlerMap.set(registration.id, handler);
    }

    return handler;
  }

  /**
   * Returns a list of ComponentInfo, which includes all
   * information about the component class, instance,
   * methods, decorators, etc. The returned list is
   * flittered by the passed decorator id.
   * @param id Component ID
   */ 
  private getComponents(id?: string) {
    if (id) {
      const set = this.componentInfoMap.get(id);
      return set ? Array.from(set) : [];
    }
    else {
      return this.getAll();
    }
  }

  private filterComponentsByDecoratorIds(components: ComponentInfo[], decoratorIds: string[]) {
    return components.filter(comp => {
      return comp.getDecoratorsIds().some(
        decoId => decoratorIds.includes(decoId)
      );
    });
  }

}