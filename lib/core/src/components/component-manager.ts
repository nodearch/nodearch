import { Container } from 'inversify';
import { ComponentScope, CoreComponentId } from './enums';
import { ClassConstructor } from '../utils';
import { IComponentsOptions } from './interfaces';
import { ICli } from './custom/cli';
import { IHook } from './custom/hook';
import { ComponentRegistry } from './registration/registry';


// TODO: integrate the new registry in here | or move this to app.ts ?! 
export class ComponentManager {

  private options: IComponentsOptions;
  private container: Container;
  private componentRegistry: ComponentRegistry;

  constructor(options?: IComponentsOptions) {
    this.options = options || {};

    this.container = new Container({
      defaultScope: this.options.defaultScope || ComponentScope.Singleton
    });

    this.componentRegistry = new ComponentRegistry(this.container);
  }

  registerCoreComponent(componentClass: ClassConstructor, componentInstance: any) {
    this.container.bind(componentClass).toConstantValue(componentInstance);
  }

  overrideCoreComponent(componentClass: ClassConstructor, componentInstance: any) {
    this.container.rebind(componentClass).toConstantValue(componentInstance);
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