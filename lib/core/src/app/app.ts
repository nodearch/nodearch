import { Container } from 'inversify';
import { ConfigManager } from '../components/config/config-manager.js';
import { IHook } from '../components/hook/hook.interface.js';
import { TestManager } from '../components/test/test-manager.js';
import { MochaAnnotation, TestMode } from '../components/test/test.enums.js';
import { ComponentScope, CoreAnnotation } from '../registry/enums.js';
import { ComponentRegistry } from '../registry/registry.js';
import { DependencyException } from '../errors.js';
import { ClassLoader } from '../fs/class-loader.js';
import { ILogger, ILogOptions } from '../log/interfaces.js';
import { Logger } from '../log/logger.js';
import { ClassConstructor } from '../utils/types.js';
import { AppContext } from './app-context.js';
import { IAppInfo, IAppOptions, IInitOptions } from './app.interfaces.js';


export class App {

  // This is used to easily identifies NodeArch Apps when we auto-load classes
  public static nodearch = true;
  private extensions?: App[];
  private logOptions?: ILogOptions;
  private configOptions?: Record<string, any>;;
  private classLoader: ClassLoader;
  private logger!: ILogger;
  private appContext!: AppContext;
  private container: Container;
  private componentRegistry: ComponentRegistry;
  private testManager: TestManager;
  private appInfo?: IAppInfo;


  constructor(options: IAppOptions) {
    this.classLoader = new ClassLoader(options.components);
    this.container = new Container({
      defaultScope: options.components.scope || ComponentScope.Singleton
    });
    this.componentRegistry = new ComponentRegistry(this.container);
    this.testManager = new TestManager(this.container);
    this.extensions = options.extensions;
    this.logOptions = options.logs;
    this.configOptions = options.config;
  }

  private loadCoreComponents() {
    if (!this.logger) {
      this.logger = new Logger(this.logOptions);
    }

    // appContext is created only in the main app and passed to extensions
    if (!this.appContext) {
      this.appContext = new AppContext(this.componentRegistry, this.container, this.appInfo!);
    }

    this.container.bind(Logger).toConstantValue(this.logger as Logger);
    this.container.bind(AppContext).toConstantValue(this.appContext);
    this.container.bind(ConfigManager).toConstantValue(new ConfigManager(this.configOptions));
  }

  private async loadExtensions() {
    if (this.extensions) {
      for (const extension of this.extensions) {
        try {
          await extension.init({
            mode: 'ext',
            logger: this.logger,
            appContext: this.appContext
          });
        }
        catch (e: any) {
          throw new Error(`While trying to register Extension - ${e.message}`);
        }
      }
    }
  }


  private async loadComponents() {
    await this.classLoader.load();
    this.componentRegistry.register(this.classLoader.classes);

    // this.logger.debug(`${registered} Components Loaded`);
    // this.logger.debug(`${hooks} Hooks registered`);
    // this.logger.debug(`${exported} Components exported`);
  }

  private registerExtensions() {
    if (this.extensions) {
      this.extensions.forEach(ext => {
        this.componentRegistry.registerExtensions(ext.getExportedComponents());
      });
    }
  }

  async start() {
    const hooks = this.getAll<IHook>(CoreAnnotation.Hook);

    if (!hooks) return;

    for (const hook of hooks) {
      if (hook.onStart) {
        await hook.onStart();
      }
    }
  }

  async stop() {
    try {
      const hooks = this.getAll<IHook>(CoreAnnotation.Hook);

      if (hooks) {
        await Promise.all(hooks.filter(x => x.onStop).map(x => (<any>x.onStop)()));
      }
    }
    catch (e: any) {
      if (e.message !== 'No matching bindings found for serviceIdentifier: hook') {
        throw e;
      }
    }
  }

  async init(options: IInitOptions) {
    // TODO: We can probably add performance insights here

    if (options.mode === 'app') {
      this.appInfo = options.appInfo;
    }
    else if (options.mode === 'ext') {
      this.logger = options.logger;
      this.appContext = options.appContext;
    }

    this.loadCoreComponents();
    await this.loadExtensions();
    this.registerExtensions();
    await this.loadComponents();
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

  get<T>(id: ClassConstructor): T | undefined {
    try {
      return this.container.get<T>(id);
    }
    catch (e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${id}`) {
        throw new DependencyException(e.message);
      }
    }
  }

  getAll<T>(id: string) {
    let instances: T[] = [];

    try {
      instances = this.container.getAll<T>(id);
    }
    catch (e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${id}`) {
        throw new DependencyException(e.message);
      }
    }

    return instances;
  }

  /**
   * Returns a list of ComponentInfo, which includes all 
   * information about the component class, instance, 
   * methods, decorators, etc. The returned list is 
   * flittered by the id parameter.
   * @param id Component ID, you can also pass a CoreAnnotation value 
   * @returns ComponentInfo[]
   */
  getComponents(id: string) {
    return this.componentRegistry.getComponents(id);
  }

  /**
   * Returns a list of ComponentInfo, which includes all 
   * information about the component class, instance, 
   * methods, decorators, etc. The returned list contains
   * only the components that this app exports
   * @returns ComponentInfo[]
   */
  getExportedComponents() {
    return this.componentRegistry.getExported();
  }

  getTestSuites(testModes: TestMode[]) {
    const testComponents = this.getComponents(MochaAnnotation.Test);
    const mockComponents = this.getComponents(MochaAnnotation.Mock);

    if (testComponents) {
      return this.testManager.getTestSuitesInfo(testModes, testComponents, mockComponents)
    }
  }

  /**
   * Returns the Constructor name
   */
  get name() {
    return this.constructor.name;
  }
}