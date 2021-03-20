import { Container } from 'inversify';
import { ComponentMetadata } from './component.metadata';
import { ComponentType, ComponentScope } from './enums';
import { ClassConstructor } from '../utils';
import { ComponentHandler } from './component/component.handler';
import {IComponentHandler, IComponentInfo, IComponentsOptions} from './interfaces';
import { HookHandler, IHook } from './hook';
import { ControllerHandler } from './controller';
import { ConfigHandler } from './config';
import { RepositoryHandler } from './repository';
import { ServiceHandler } from './service';
import { InterceptorProviderHandler } from './interceptor';
import { CLIHandler, ICLI } from './cli';


export class ComponentManagement {

  private options: IComponentsOptions;
  private container: Container;
  private componentsRegistry: Map<ComponentType, { components: ClassConstructor[], handler: IComponentHandler}>;

  constructor(options?: IComponentsOptions) {
    this.options = options || {};

    this.container = new Container({
      defaultScope: this.options.defaultScope || ComponentScope.Singleton
    });

    this.componentsRegistry = new Map();

    this.initComponentsHandlers();
  }

  private initComponentsHandlers() {
    // TODO: NOTE - not sure if this is useful at this point, all the handlers does the same logic so far
    this.componentsRegistry.set(ComponentType.Component, { components: [], handler: new ComponentHandler(this.container) });
    this.componentsRegistry.set(ComponentType.Hook, { components: [], handler: new HookHandler(this.container) });
    this.componentsRegistry.set(ComponentType.Controller, { components: [], handler: new ControllerHandler(this.container) });
    this.componentsRegistry.set(ComponentType.Config, { components: [], handler: new ConfigHandler(this.container) });
    this.componentsRegistry.set(ComponentType.Repository, { components: [], handler: new RepositoryHandler(this.container) });
    this.componentsRegistry.set(ComponentType.Service, { components: [], handler: new ServiceHandler(this.container) });
    this.componentsRegistry.set(ComponentType.InterceptorProvider, { components: [], handler: new InterceptorProviderHandler(this.container) });
    this.componentsRegistry.set(ComponentType.CLI, { components: [], handler: new CLIHandler(this.container) });
  }

  registerCoreComponent(componentClass: ClassConstructor, componentInstance: any) {
    this.container.bind(componentClass).toConstantValue(componentInstance);
  }

  overrideCoreComponent(componentClass: ClassConstructor, componentInstance: any) {
    this.container.rebind(componentClass).toConstantValue(componentInstance);
  }

  registerExtension(components: ComponentManagement, includes: ClassConstructor[]) {
    includes.forEach(classDef => {
      const componentInfo = ComponentMetadata.getInfo<IComponentInfo>(classDef);

      if (!componentInfo) throw new Error(`Class ${classDef.name} is not a Components`);

      const comRegistry = this.componentsRegistry.get(componentInfo.type as ComponentType);

      if (!comRegistry) throw new Error(`Class ${classDef.name} is not recognized as one of the supported Components`);

      // just check we can resolve the component early
      try {
        components.get(classDef);
      }
      catch(e) {
        throw new Error(`Can't resolve Component ${classDef.name}`);
      }

      comRegistry.handler.registerExtension(classDef, components.container);
    });
  }

  registerCore(coreClass: any, coreValue: any) { //TODO: remove this method, we already have registerCoreComponent
    this.container.bind(coreClass).toConstantValue(coreValue);
  }

  load(classes: ClassConstructor[]) {
    let registered = 0;

    classes.forEach(classDef => {
      const componentInfo = ComponentMetadata.getInfo<IComponentInfo>(classDef);

      if (componentInfo) {
        const comRegistry = this.componentsRegistry.get(componentInfo.type as ComponentType);

        if (comRegistry) {
          comRegistry.components.push(classDef);
          comRegistry.handler.register(classDef, componentInfo);
          registered++;
        }
      }
    });

    return registered;
  }

  get<T>(classIdentifier: ClassConstructor): T {
    return this.container.get<T>(classIdentifier);
  }

  getAll<T>(identifier: ComponentType | string | symbol): T[] {
    return this.container.getAll<T>(identifier);
  }

  private findGroupedCompByType<T>(compType: ComponentType): T[] | undefined {
    try {
      return this.getAll<T>(compType);
    }
    catch(e) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${compType}`) {
        throw e;
      }
    }
  }

  findHooks(): IHook[] | undefined {
    return this.findGroupedCompByType(ComponentType.Hook);
  }

  findCLICommands(): ICLI[] | undefined {
    return this.findGroupedCompByType(ComponentType.CLI);
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

  getComponents(componentType: ComponentType) {
    const comRegistry = this.componentsRegistry.get(componentType);
    
    if (comRegistry) {
      return comRegistry.components.length ? comRegistry.components : undefined;
    } 
  }
}