import inversify from 'inversify';
import { Container } from '../container/container.js';
import { ConfigManager } from '../components/config/config-manager.js';
import { IHook } from '../components/hook/hook.interface.js';
import { ClassLoader } from '../fs/class-loader.js';
import { ILogger, ILogOptions } from '../log/interfaces.js';
import { Logger } from '../log/logger.js';
import { AppContext } from './app-context.js';
import { IAppOptions, IAppSettings, IInitOptions } from './app.interfaces.js';
import { ComponentRegistry } from '../components/component-registry.js';
import { ComponentScope, CoreDecorator } from '../components/enums.js';
import { ClassConstructor } from '../utils.index.js';
import { AppState } from './app.enums.js';


export class App {

  public static nodearch = true;
  private componentRegistry: ComponentRegistry;
  private container: Container;
  private extensions?: App[];
  private logOptions: ILogOptions;
  private configOptions?: Record<string, any>;
  private classLoader: ClassLoader;
  private logger!: ILogger;
  private appContext!: AppContext;
  private inversifyContainer: inversify.Container;
  private appSettings?: IAppSettings;
  private hooks: IHook[];
  private appState: AppState;
  private startedAt!: [number, number];


  constructor(options: IAppOptions) {
    this.classLoader = new ClassLoader(options.components);
    this.inversifyContainer = new inversify.Container({
      defaultScope: options.components.scope || ComponentScope.SINGLETON
    });
    this.container = new Container(this.inversifyContainer);
    this.componentRegistry = new ComponentRegistry(this.container);
    this.extensions = options.extensions;
    this.logOptions = options.logs || {};
    this.configOptions = options.config;
    this.hooks = [];
    this.appState = AppState.NONE;
  }

  async start() {
    if (this.appState === AppState.STARTED) return;
    this.appState = AppState.STARTED;

    this.initHooks();
    for (const hook of this.hooks) {
      if (hook.onStart) {
        await hook.onStart();
      }
    }

    if (this.appSettings && !this.appSettings.disableBootstrapMetrics) {
      const time = process.hrtime(this.startedAt);
      const ms = Math.round((time[0] * 1000) + (time[1] / 1000000));
      this.logger.info(`App Started in ${ms}ms`);
    }
  }

  async stop() {
    if (this.appState === AppState.STOPPED) return;
    this.appState = AppState.STOPPED;

    for (const hook of this.hooks) {
      if (hook.onStop) {
        await hook.onStop();
      }
    }
  }

  async init(options: IInitOptions) {
    if (this.appState === AppState.INITIATED) return;
    this.appState = AppState.INITIATED;
    
    if (options.mode === 'app') {
      this.appSettings = options.appSettings;
    }
    else if (options.mode === 'ext') {
      this.logOptions = { ...options.logs, prefix: this.logOptions.prefix || 'EXT' };
      this.appContext = options.appContext;
    }

    const bootstrapLogs = options.mode === 'app' && (this.appSettings && !this.appSettings.disableBootstrapMetrics);

    if (bootstrapLogs)
      this.startedAt = process.hrtime();

    this.loadCoreComponents();

    await this.loadExtensions();
    this.registerExtensions();

    await this.loadComponents();

    if (bootstrapLogs) {
      const componentsCount = this.componentRegistry.count();
      const extensionsCount = this.extensions?.length || 0;
      const hooksCount = this.componentRegistry
        .get<IHook>({ id: CoreDecorator.HOOK }).length;

      const end = process.hrtime(this.startedAt);
      const time = Math.round((end[0] * 1000) + (end[1] / 1000000));

      this.logger.info(`${componentsCount} Components, ${extensionsCount} Extensions, ${hooksCount} Hooks Loaded in ${time}ms`);
    }
  }

  /**
   * Return the DI container
   */
  getContainer() {
    return this.container;
  }

  /**
   * Returns the components registered in the app
   */
  getComponentRegistry() {
    return this.componentRegistry;
  }

  getSettings() {
    if (!this.appSettings) throw new Error('App Settings is not available before calling init() on the App');

    return this.appSettings;
  }

  /**
   * Returns the Constructor name
   */
  getName() {
    return this.appSettings?.name || this.constructor.name;
  }

  private loadCoreComponents() {
    this.logger = new Logger(this.logOptions);

    // appContext is created only in the main app and passed to extensions
    if (!this.appContext) {
      // this.appContext = new AppContext(this.componentRegistry, this.container, this.appSettings!, this.logger.getLogLevel());
      this.appContext = this;
    }

    this.container.bindConstant(Logger, this.logger);
    this.container.bindConstant(AppContext as ClassConstructor, this.appContext);
    this.container.bindConstant(ConfigManager, new ConfigManager(this.configOptions));
  }

  private async loadExtensions() {
    if (this.extensions) {
      for (const extension of this.extensions) {
        try {
          await extension.init({
            mode: 'ext',
            logs: this.logOptions,
            appContext: this.appContext
          });
        }
        catch (e: any) {
          throw new Error(`While trying to register Extension ${extension.getName()} - ${e.message}`);
        }
      }
    }
  }

  private registerExtensions() {
    if (this.extensions) {
      this.extensions.forEach(ext => {
        this.componentRegistry.registerExtension(ext.getComponentRegistry(), ext.getContainer());
      });
    }
  }

  private async loadComponents() {
    await this.classLoader.load();
    this.componentRegistry.register(this.classLoader.classes);
    this.componentRegistry.registerDataComponents();
    // this.logger.debug(`${registered} Components Loaded`);
    // this.logger.debug(`${hooks} Hooks registered`);
    // this.logger.debug(`${exported} Components exported`);
  }

  private initHooks() {
    this.hooks = this.componentRegistry
      .get<IHook>({ id: CoreDecorator.HOOK })
      .map(compInfo => compInfo.getInstance());
  }
} 