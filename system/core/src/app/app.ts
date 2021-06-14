import { ClassLoader } from '../loader';
import { ComponentManager, HookContext, ComponentType, IHook, ConfigManager } from '../component';
import { IAppInfo, IAppOptions, IRunOptions, RunMode } from './app.interfaces';
import { ILogger, ILogOptions, Logger, LogLevel } from '../log';
import { IConfigOptions } from '../config/interfaces';
// import pkg from '../../package.json';
// const pkg = require('../../package.json');

export class App {
  componentManager: ComponentManager;
  appInfo: IAppInfo;
  private extensions?: App[];
  private logOptions?: ILogOptions;
  private configOptions?: IConfigOptions;
  private classLoader: ClassLoader;
  private hookContext: HookContext;
  private logger!: ILogger;


  constructor(options: IAppOptions) {
    this.classLoader = new ClassLoader(options.classLoader);
    this.componentManager = new ComponentManager({ defaultScope: options.defaultScope });
    this.hookContext = new HookContext(this.componentManager);
    this.appInfo = options.appInfo;
    this.extensions = options.extensions;
    this.logOptions = options.log;
    this.configOptions = options.config;
  }

  private loadCoreComponents() {
    if (!this.logger) {
      this.logger = new Logger(this.logOptions);
    }

    this.componentManager.registerCoreComponent(Logger, this.logger);
    this.componentManager.registerCoreComponent(ConfigManager, new ConfigManager(this.configOptions));
  }

  private async loadExtensions () {
    if (this.extensions) {
      this.logger.debug(`Found ${this.extensions.length} Extensions!`);

      // TODO: consider making this Promise.all
      for (const extension of this.extensions) {
        try {
          await extension.run({ mode: RunMode.EXT, logger: this.logger });
        }
        catch (e) {
          throw new Error(`While trying to register Extension - ${e.message}`);
        }
      }
    }
  } 

  private async loadComponents() {
    this.logger.info(`Load App: ${this.appInfo.name} version: ${this.appInfo.version}`);

    await this.classLoader.load();
    const { registered, hooks, exported } = this.componentManager.load(this.classLoader.classes);
    this.logger.debug(`${registered} Components Loaded`);
    this.logger.debug(`${hooks} Hooks registered`);
    this.logger.debug(`${exported} Component exported`);
  }

  private registerExtensions() {
    if (this.extensions) {
      this.componentManager.registerExternalComponents(this.extensions.map(ext => ext.componentManager));
    }
  }

  private async init() {
    const hooks: any[] = this.componentManager.findHooks() || [];
      
    for (const hook of hooks) {
      if (hook.onInit) {
        await hook.onInit(this.hookContext);
      }
    }
  }

  private async start() {
    const hooks: any[] = this.componentManager.findHooks() || [];

    for (const hook of hooks) {
      if (hook.onStart) {
        await hook.onStart(this.hookContext);
      }
    }
  }

  async run(runOptions: IRunOptions = { mode: RunMode.APP }) {

    if (runOptions.mode === RunMode.EXT) {
      this.logger = runOptions.logger;
    }

    this.loadCoreComponents();

    await this.loadExtensions();
    await this.loadComponents();
    this.registerExtensions();

    if (runOptions.mode === RunMode.APP) {
      await this.init();
      await this.start();
    }
  }

  async stop() {
    try {
      const hooks = this.componentManager.getAll<IHook>(ComponentType.Hook);

      if (hooks) {
        await Promise.all(hooks.filter(x => x.onStop).map(x => (<any>x.onStop)(this.hookContext)));
      }
    }
    catch (e) {
      if (e.message !== 'No matching bindings found for serviceIdentifier: hook') {
        throw e;
      }
    }
  }

  setLogLevel(logLevel: LogLevel) {
    this.logger.setLogLevel(logLevel);
  }

  /**
   * Allows to change the core logger after App initialization 
   * @param logger logger instance that comply with the core interface ILogger
   */
  setLogger(logger: ILogger) {
    this.componentManager.overrideCoreComponent(Logger, logger);
  }
}