import { Container } from '../app/container.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentHandler } from './component-handler.js';
import { ComponentInfo } from './component-info.js';
import { IUseDecoratorOptions } from './component/interfaces.js';
import { isComponent } from './decorator-factory.js';
import { CoreDecorator } from './enums.js';
import { IComponentRegistration, IGetComponentsOptions, IGetDecoratorsOptions } from './interfaces.js';
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
    let components: ComponentInfo[] = [];

    if (id) {
      const set = this.componentInfoMap.get(id);
      
      if (set) {
        components = Array.from(set);
      }
    }
    else {
      components = this.getAll();
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