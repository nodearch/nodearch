import { Container } from 'inversify';
import { ComponentMetadata } from './component.metadata';
import { ComponentScope, CoreComponentId } from './enums';
import { ClassConstructor } from '../utils';
import { ComponentHandler } from './component';
import {IComponentHandler, IComponentInfo, IComponentsOptions, IExportedComponent} from './interfaces';
import { IHook } from './hook';
import { ICli } from './cli';


export class ComponentManager {

  private options: IComponentsOptions;
  container: Container;
  private componentsRegistry: Map<string, { components: ClassConstructor[], handler: IComponentHandler }>;
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

      exportedComps.forEach(({ classDef, info }) => {
        const comRegistry = this.getComponentRegistry(info);
        comRegistry.handler.registerExtension?.(classDef, info, compManager.container);
      });

    });
  }

  load(classes: ClassConstructor[], include: string[]) {
    let registered = 0,
      hooks = 0,
      exported = 0;

    classes.forEach(classDef => {
      const componentInfo = ComponentMetadata.getInfo<IComponentInfo>(classDef);

      if (componentInfo && include.includes(componentInfo.id)) {

        const comRegistry = this.getComponentRegistry(componentInfo);

        comRegistry.components.push(classDef);

        if (componentInfo.options?.export) {
          this.exportedComponents.push({
            classDef,
            info: componentInfo
          });
          exported++;
        }

        comRegistry.handler.register(classDef, componentInfo);
        
        registered++;
        // if (componentInfo.type === ComponentType.Hook) hooks++;
      }
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
        handler: new (componentInfo.handler || ComponentHandler)(this.container) // TODO - change the default handler?
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