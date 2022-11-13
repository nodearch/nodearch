import { ClassLoader } from '../loader';
import { 
  HookContext, CoreAnnotation, IHook, 
  ConfigManager, ComponentScope, ComponentRegistry, TestManager, TestMode, MochaAnnotation, ComponentInfo 
} from '../components';
import { IAppOptions, IRunOptions } from './app.interfaces';
import { ILogger, ILogOptions, Logger } from '../log';
import { Container } from 'inversify';
import { ClassConstructor } from '../utils';
import { DependencyException } from '../errors';

export class App {

  // This is used to easily identifies NodeArch Apps when we auto-load classes
  public static nodearch = true; 
  private extensions?: App[];
  private logOptions?: ILogOptions;
  private configOptions?: Record<string, any>;;
  private classLoader: ClassLoader;
  private hookContext: HookContext;
  private logger!: ILogger;
  private container: Container;
  private componentRegistry: ComponentRegistry;
  private testManager: TestManager;


  constructor(options: IAppOptions = {}) {

    this.classLoader = new ClassLoader(options.components);
    
    this.container = new Container({
      defaultScope: options.scope || ComponentScope.Singleton
    });

    this.componentRegistry = new ComponentRegistry(this.container);

    this.hookContext = new HookContext(this.componentRegistry, this.container);
    this.testManager = new TestManager(this.container);
    this.extensions = options.extensions;
    this.logOptions = options.logs;
    this.configOptions = options.config;
  }

  private loadCoreComponents() {
    if (!this.logger) {
      this.logger = new Logger(this.logOptions);
    }

    this.container.bind(Logger).toConstantValue(this.logger as Logger);
    this.container.bind(ConfigManager).toConstantValue(new ConfigManager(this.configOptions));
  }

  private async loadExtensions () {
    if (this.extensions) {
      this.logger.debug(`Found ${this.extensions.length} Extensions!`);

      // TODO: consider making this Promise.all
      for (const extension of this.extensions) {
        try {
          await extension.run({
            logger: this.logger // propagate the logger to the extension
          });
        }
        catch (e: any) {
          throw new Error(`While trying to register Extension - ${e.message}`);
        }
      }
    }
  } 

  
  private async loadComponents() {
    this.logger.info(`Registering App: ${this.appName}`);

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

  async init() {
    const hooks = this.getAll<IHook>(CoreAnnotation.Hook);

    if (!hooks) return;

    for (const hook of hooks) {
      if (hook.onInit) {
        await hook.onInit(this.hookContext);
      }
    }
  }

  async start() {
    const hooks = this.getAll<IHook>(CoreAnnotation.Hook);
      
    if (!hooks) return;

    for (const hook of hooks) {
      if (hook.onStart) {
        await hook.onStart(this.hookContext);
      }
    }
  }

  async stop() {
    try {
      const hooks = this.getAll<IHook>(CoreAnnotation.Hook);

      if (hooks) {
        await Promise.all(hooks.filter(x => x.onStop).map(x => (<any>x.onStop)(this.hookContext)));
      }
    }
    catch (e: any) {
      if (e.message !== 'No matching bindings found for serviceIdentifier: hook') {
        throw e;
      }
    }
  }

  async run(options?: IRunOptions) {
    // TODO: We can probably add performance insights here

    /**
     * If a logger was passed, set it here, so at later step, 
     * it would just skip the creation of a new logger instance. 
     * Also, that probably means this is an extension context
     * and the logger is being passed from the parent App.
     */ 
    if (options?.logger) this.logger = options.logger;

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
    catch(e: any) {
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
    catch(e: any) {
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
  get appName () {
    return this.constructor.name;
  }
}