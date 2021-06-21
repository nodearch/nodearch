import { Container } from 'inversify';
import { ComponentMetadata } from './component.metadata';
import { ComponentType, ComponentScope } from './enums';
import { ClassConstructor } from '../utils';
import { ComponentHandler } from './component/component.handler';
import {IComponentHandler, IComponentInfo, IComponentsOptions, IExportedComponent} from './interfaces';
import { HookHandler, IHook } from './hook';
import { ControllerHandler } from './controller';
import { ConfigHandler } from './config';
import { RepositoryHandler } from './repository';
import { ServiceHandler } from './service';
import { InterceptorHandler } from './interceptor';
import { CliHandler, ICli } from './cli';
import { TestHandler } from './test/test.handler';
import { TestManager } from './test/test-manager'
import { ITestRunner } from './test';


export class ComponentManager {

  private options: IComponentsOptions;
  private container: Container;
  private componentsRegistry: Map<ComponentType, { components: ClassConstructor[], handler: IComponentHandler}>;
  private exportedComponents: IExportedComponent[];

  constructor(options?: IComponentsOptions) {
    this.options = options || {};

    this.container = new Container({
      defaultScope: this.options.defaultScope || ComponentScope.Singleton
    });

    this.componentsRegistry = new Map();
    this.exportedComponents = [];

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
    this.componentsRegistry.set(ComponentType.Interceptor, { components: [], handler: new InterceptorHandler(this.container) });
    this.componentsRegistry.set(ComponentType.Cli, { components: [], handler: new CliHandler(this.container) });
    this.componentsRegistry.set(ComponentType.Test, { components: [], handler: new TestHandler(this.container) });
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
        const comRegistry = <{ handler: IComponentHandler }>this.componentsRegistry.get(info.type);
        if (comRegistry.handler.registerExtension) {
          comRegistry.handler.registerExtension(classDef, compManager.container);
        }
      });

    });
  }

  load(classes: ClassConstructor[], include: ComponentType[]) {
    let registered = 0,
      hooks = 0,
      exported = 0;

    classes.forEach(classDef => {
      const componentInfo = ComponentMetadata.getInfo<IComponentInfo>(classDef);

      if (componentInfo && include.includes(componentInfo.type)) {

        const comRegistry = this.componentsRegistry.get(componentInfo.type);

        if (comRegistry) {
          comRegistry.components.push(classDef);

          if (componentInfo.export) {
            this.exportedComponents.push({
              classDef,
              info: componentInfo
            });
            exported++;
          }

          comRegistry.handler.register(classDef, componentInfo);
          
          registered++;
          if (componentInfo.type === ComponentType.Hook) hooks++;
        }
      }
    });

    return {
      registered,
      hooks,
      exported
    };
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

  findTests() {
    return this.findGroupedCompByType(ComponentType.Test);
  }

  findCLICommands(): ICli[] | undefined {
    return this.findGroupedCompByType(ComponentType.Cli);
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

  getExported() {
    return this.exportedComponents;
  }

  async runTests(testRunner: ITestRunner) {
    const testComponents = this.getComponents(ComponentType.Test);
    
    if (testComponents) {
      const testManager = new TestManager(testRunner, testComponents, this.container);      
      const failureCode = await testManager.run();
      process.exit(failureCode);
    }
  }
}