import inversify from 'inversify';
import { Container } from './container.js';
import { ConfigManager } from '../components/config/config-manager.js';
import { IHook } from '../components/hook/hook.interface.js';
import { ComponentScope, CoreAnnotation } from '../registry/enums.js';
import { ComponentRegistry } from '../registry/registry.js';
import { ClassLoader } from '../fs/class-loader.js';
import { ILogger, ILogOptions } from '../log/interfaces.js';
import { Logger } from '../log/logger.js';
import { AppContext } from './app-context.js';
import { IAppInfo, IAppOptions, IInitOptions } from './app.interfaces.js';
import { LogLevel } from '../index.js';


export class App {

  public static nodearch = true;
  public components: ComponentRegistry;
  public container: Container;
  
  private extensions?: App[];
  private logOptions: ILogOptions;
  private configOptions?: Record<string, any>;
  private classLoader: ClassLoader;
  private logger!: ILogger;
  private appContext!: AppContext;
  private inversifyContainer: inversify.Container;
  private appInfo?: IAppInfo;


  constructor(options: IAppOptions) {
    this.classLoader = new ClassLoader(options.components);
    this.inversifyContainer = new inversify.Container({
      defaultScope: options.components.scope || ComponentScope.Singleton
    });
    this.container = new Container(this.inversifyContainer);
    this.components = new ComponentRegistry(this.container);
    this.extensions = options.extensions;
    this.logOptions = options.logs || {};
    this.configOptions = options.config;
  }

  private loadCoreComponents() {
    this.logger = new Logger(this.logOptions);

    // appContext is created only in the main app and passed to extensions
    if (!this.appContext) {
      this.appContext = new AppContext(this.components, this.container, this.appInfo!, this.logger.getLogLevel());
    }

    this.container.bindToConstant(Logger, this.logger);
    this.container.bindToConstant(AppContext, this.appContext);
    this.container.bindToConstant(ConfigManager, new ConfigManager(this.configOptions));
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
          throw new Error(`While trying to register Extension - ${e.message}`);
        }
      }
    }
  }


  private async loadComponents() {
    await this.classLoader.load();
    this.components.register(this.classLoader.classes);

    // this.logger.debug(`${registered} Components Loaded`);
    // this.logger.debug(`${hooks} Hooks registered`);
    // this.logger.debug(`${exported} Components exported`);
  }

  private registerExtensions() {
    if (this.extensions) {
      this.extensions.forEach(ext => {
        this.components.registerExtensions(ext.components.getExported());
      });
    }
  }

  async start() {
    const hooks = this.container.getComponentGroup<IHook>(CoreAnnotation.Hook);

    if (!hooks) return;

    for (const hook of hooks) {
      if (hook.onStart) {
        await hook.onStart();
      }
    }
  }

  async stop() {
    const hooks = this.container.getComponentGroup<IHook>(CoreAnnotation.Hook);

    if (hooks) {
      await Promise.all(hooks.filter(x => x.onStop).map(x => (<any>x.onStop)()));
    }
  }

  async init(options: IInitOptions) {
    // TODO: We can probably add performance insights here

    if (options.mode === 'app') {
      this.appInfo = options.appInfo;
    }
    else if (options.mode === 'ext') {
      this.logOptions = { ...options.logs, prefix: this.logOptions.prefix || 'EXT' };
      this.appContext = options.appContext;
    }

    this.loadCoreComponents();
    await this.loadExtensions();
    this.registerExtensions();
    await this.loadComponents();
  }

  /**
   * Returns the Constructor name
   */
  get name() {
    return this.constructor.name;
  }
} 