import { Container } from 'inversify';
import { ComponentMetadata } from './component.metadata';
import { ComponentScope, CoreComponentId } from './enums';
import { ClassConstructor } from '../utils';
import { ComponentHandler } from './component';
import {IComponentHandler, IComponentInfo, IComponentRegistryInfo, IComponentsOptions, IExportedComponent} from './interfaces';
import { IHook } from './hook';
import { ICli } from './cli';


export class ComponentManager {

  private options: IComponentsOptions;
  container: Container;
  private componentsRegistry: Map<string, { components: IComponentRegistryInfo[], handler: IComponentHandler }>;
  private exportedComponents: IExportedComponent[];

  constructor(options?: IComponentsOptions) {
    this.options = options || {};

    this.container = new Container({
      defaultScope: this.options.defaultScope || ComponentScope.Singleton
    });

    this.componentsRegistry = new Map();
    this.exportedComponents = [];
  }

  registerCoreComponent(componentClass: ClassConstructor, componentInstance: any) {
    this.container.bind(componentClass).toConstantValue(componentInstance);
  }

  overrideCoreComponent(componentClass: ClassConstructor, componentInstance: any) {
    this.container.rebind(componentClass).toConstantValue(componentInstance);
  }

  registerExternalComponents(compManagers: ComponentManager[]) {
    compManagers.forEach(compManager => {
      const exportedComps = compManager.getExported();

      exportedComps.forEach(({ classConstructor, info }) => {
        const comRegistry = this.getComponentRegistry(info);
        comRegistry.handler.registerExtension?.(classConstructor, info, compManager.container);
      });

    });
  }

  load(classes: ClassConstructor[], excludeIds?: string[]) {
    let registered = 0,
      hooks = 0,
      exported = 0;

    classes.forEach(classConstructor => {
      const componentInfo = ComponentMetadata.getComponentInfo(classConstructor);

      if (!componentInfo) return;
      
      if (excludeIds?.includes(componentInfo.id)) return;


      const comRegistry = this.getComponentRegistry(componentInfo);

      const decorators = ComponentMetadata.getComponentDecorators(classConstructor);

      comRegistry.components.push({
        classConstructor,
        componentInfo,
        decorators,
        getInstance: () => { // TODO: replace this object with a class
          return this.get(classConstructor);
        },
      });

      if (componentInfo.options?.export) {
        this.exportedComponents.push({
          classConstructor,
          info: componentInfo
        });
        exported++;
      }

      comRegistry.handler.register(classConstructor, componentInfo);
      
      registered++;

      if (componentInfo.id === CoreComponentId.Hook) hooks++;
    });

    return {
      registered,
      hooks,
      exported
    };
  }

  private getComponentRegistry(componentInfo: IComponentInfo) {
    let comRegistry = this.componentsRegistry.get(componentInfo.id);

    if (!comRegistry) {
      comRegistry = {
        components: [],
        handler: new (componentInfo.handler || ComponentHandler)(this.container)
      };
      this.componentsRegistry.set(componentInfo.id, comRegistry);
    }

    return comRegistry;
  }

  get<T>(classIdentifier: ClassConstructor): T {
    return this.container.get<T>(classIdentifier);
  }

  getAll<T>(id: string | symbol): T[] {
    return this.container.getAll<T>(id);
  }

  private findGroupedCompById<T>(id: string): T[] | undefined {
    try {
      return this.getAll<T>(id);
    }
    catch(e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${id}`) {
        throw e;
      }
    }
  }

  findHooks(): IHook[] | undefined {
    return this.findGroupedCompById(CoreComponentId.Hook);
  }

  findTests() {
    return this.findGroupedCompById(CoreComponentId.Test);
  }

  findCLICommands(): ICli[] | undefined {
    return this.findGroupedCompById(CoreComponentId.Cli);
  }

  snapshot() {
    this.container.snapshot();
  }

  restore() {
    this.container.restore();
  }

  override(component: ClassConstructor, value: any) {
    this.container.rebind(component).toConstantValue(value);
  }

  clearCache() {
    const compsMap = (<Map<any, any[]>>(<any>this.container)._bindingDictionary._map);
    
    compsMap.forEach(comps => {
      comps.forEach(comp => {
        if (comp.type === 'Instance') {
          comp.cache = null;
          comp.activated = false;
        }
      });
    });
  }

  getComponents(id: string) {
    const comRegistry = this.componentsRegistry.get(id);
    if (comRegistry) {
      return comRegistry.components.length ? comRegistry.components : undefined;
    } 
  }

  getExported() {
    return this.exportedComponents;
  }

  getContainer() {
    return this.container;
  }
}