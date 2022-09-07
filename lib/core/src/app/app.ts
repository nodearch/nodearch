import { ClassLoader } from '../loader';
import { 
  IConfigOptions, HookContext, 
  CoreComponentId, IHook, ConfigManager, 
  ComponentScope, ComponentRegistry 
} from '../components';
import { IAppOptions, IRunOptions } from './app.interfaces';
import { ILogger, ILogOptions, Logger } from '../log';
import { Container } from 'inversify';
import { ClassConstructor } from '../utils';

export class App {  
  private extensions?: App[];
  private logOptions?: ILogOptions;
  private configOptions?: IConfigOptions;
  private classLoader: ClassLoader;
  private hookContext: HookContext;
  private logger!: ILogger;
  private container: Container;
  private componentRegistry: ComponentRegistry;


  constructor(options: IAppOptions) {
    this.classLoader = new ClassLoader(options.classLoader);
    
    this.container = new Container({
      defaultScope: options.defaultScope || ComponentScope.Singleton
    });

    this.componentRegistry = new ComponentRegistry(this.container);

    this.hookContext = new HookContext(this.componentManager);
    this.extensions = options.extensions;
    this.logOptions = options.log;
    this.configOptions = options.config;
  }

  private loadCoreComponents() {
    if (!this.logger) {
      this.logger = new Logger(this.logOptions);
    }

    this.container.bind(Logger).toConstantValue(this.logger as Logger);
    this.container.bind(ConfigManager).toConstantValue(new ConfigManager(this.configOptions));
  }

  private async loadExtensions (exclude?: string[]) {
    if (this.extensions) {
      this.logger.debug(`Found ${this.extensions.length} Extensions!`);

      // TODO: consider making this Promise.all
      for (const extension of this.extensions) {
        try {
          await extension.run({
            exclude,
            extExclude: exclude,
            logger: this.logger
          });
        }
        catch (e: any) {
          throw new Error(`While trying to register Extension - ${e.message}`);
        }
      }
    }
  } 

  
  private async loadComponents(excludeIds?: string[]) {
    this.logger.info(`Registering App: ${this.appName}`);

    await this.classLoader.load();
    // TODO: add excludes
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
    const hooks = this.getAll<IHook[]>(CoreComponentId.Hook);
      
    if (!hooks) return;

    for (const hook of hooks) {
      if (hook.onInit) {
        await hook.onInit(this.hookContext);
      }
    }
  }

  async start() {
    const hooks = this.getAll<IHook[]>(CoreComponentId.Hook);
      
    if (!hooks) return;

    for (const hook of hooks) {
      if (hook.onStart) {
        await hook.onStart(this.hookContext);
      }
    }
  }
  
  // private async runTest(runOptions: IRunTest) {
  //   this.loadCoreComponents();

  //   if (runOptions.testMode.includes(TestMode.INTEGRATION) || runOptions.testMode.includes(TestMode.E2E)) {
  //     await this.loadExtensions(false);
  //   }

  //   await this.loadComponents([
  //     CoreComponentId.Cli,
  //     CoreComponentId.Component,
  //     CoreComponentId.Config,
  //     CoreComponentId.Controller,
  //     CoreComponentId.Hook,
  //     CoreComponentId.Interceptor,
  //     CoreComponentId.Repository,
  //     CoreComponentId.Service,
  //     CoreComponentId.Test
  //   ]);

  //   if (runOptions.testMode.includes(TestMode.INTEGRATION) || runOptions.testMode.includes(TestMode.E2E)) {
  //     this.registerExtensions();
  //   }

  //   const testComponents = this.componentManager.getComponents(CoreComponentId.Test);
    
  //   if (testComponents) {
  //     const testManager = new TestManager(runOptions.testRunner, testComponents, runOptions.testMode, this.componentManager.container);      
  //     testManager.init();
      
  //     if (runOptions.testMode.includes(TestMode.INTEGRATION) || runOptions.testMode.includes(TestMode.E2E)) {
  //       await this.init();
  //     }
      
  //     if (runOptions.testMode.includes(TestMode.E2E)) {
  //       await this.start();
  //     }

  //     await runOptions.testRunner.run();
      
  //     if (runOptions.testMode.includes(TestMode.E2E)) {
  //       await this.stop();
  //     }
  //   }

  // }

  // TODO: Extend the API to support include/exclude with patterns for full flexibility
  async run(options: IRunOptions = {}) {
    // TODO: We can probably add performance insights here
    options = {
      exclude: [
        CoreComponentId.Cli,
        CoreComponentId.Test
      ],
      ...options 
    };

    if (options.logger) this.logger = options.logger;

    this.loadCoreComponents();
    await this.loadExtensions(options.extExclude);
    await this.loadComponents(options.exclude);
    this.registerExtensions();
  }

  async stop() {
    try {
      const hooks = this.getAll<IHook[]>(CoreComponentId.Hook);

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

  get<T>(id: ClassConstructor) {
    return this.container.get<T>(id);
  }

  getAll<T>(id: string) {
    try {
      return this.container.get<T>(id);
    }
    catch(e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${id}`) {
        throw e;
      }
    }
  }

  /**
   * Returns a list of ComponentInfo, which includes all 
   * information about the component class, instance, 
   * methods, decorators, etc. The returned list is 
   * flittered by the id parameter.
   * @param id Component ID, you can also pass a CoreComponentId value 
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

  /**
   * Returns the Constructor name
   */
  get appName () {
    return this.constructor.name;
  }
}