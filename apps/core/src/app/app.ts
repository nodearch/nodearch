import { ClassLoader } from '../loader';
import { ComponentManagement, HookContext, ComponentType, IHook, AppStage, ConfigManager } from '../components';
import { IAppOptions } from './app.interfaces';
import { ConsoleLogger, ILogger, Logger, LogLevel } from '../logger';
import { ICLI } from '../components/cli/cli.interfaces';

export class App {
  protected components: ComponentManagement;
  protected isRunCalled: boolean;
  private options: IAppOptions;
  private classLoader: ClassLoader;
  private hookContext: HookContext;
  private logger: ILogger;
  private hooks: IHook[];

  constructor(options?: IAppOptions) {
    this.options = options || {};
    this.classLoader = new ClassLoader(this.options.classLoader);
    this.components = new ComponentManagement({ defaultScope: this.options.defaultScope });
    this.hookContext = new HookContext(this.components);
    this.logger = this.initLogger();
    this.initConfigManager();
    this.hooks = [];
    this.isRunCalled = false;
  }

  private initLogger() {
    const { logger, logLevel, ...loggingOptions } = this.options.logging || {};

    const loggerInstance = new Logger(logger ?
        new logger(loggingOptions) :
        new ConsoleLogger(loggingOptions),
        logLevel
    );

    this.components.registerCoreComponent(Logger, loggerInstance);

    return loggerInstance;
  }

  private initConfigManager() {
    const configManager = new ConfigManager(this.options.externalConfig);
    this.components.registerCoreComponent(ConfigManager, configManager);
    return configManager;
  }

  protected async load() {
    this.logger.debug('NodeArch - Node.js backend framework');
    this.logger.debug('Documentation: nodearch.io');
    this.logger.debug('Starting APP Instance...');

    if (this.options.extensions?.length) {
      this.logger.debug(`Found ${this.options.extensions?.length} Extensions!`);
      this.logger.debug('Initializing Extensions Started!');
      await this.initExtensions();
      this.logger.debug('Extensions Initialized!');
    }

    this.logger.debug('Starting to Load Components...');
    await this.classLoader.load();

    const loadedCount = this.components.load(this.classLoader.classes);
    this.logger.debug(`${loadedCount} Components Loaded!`);

    try {
      this.hooks = this.components.getAll<IHook>(ComponentType.Hook);
      this.logger.debug(`${this.hooks?.length || 0} Hooks registered!`);
    }
    catch(e) {
      if (e.message === 'No matching bindings found for serviceIdentifier: hook') {
        this.logger.debug('No Hooks registered!');
      }
      else {
        throw e;
      }
    }
  }

  protected async init() {
    if (this.hooks) {
      await Promise.all(this.hooks.filter(x => x.onInit).map(x => (<any>x.onInit)(this.hookContext)));
    }

    this.logger.debug('APP Instance Initialized successfully!');
  }

  protected async start() {
    if (this.hooks) {
      await Promise.all(this.hooks.filter(x => x.onStart).map(x => (<any>x.onStart)(this.hookContext)));
    }

    this.logger.debug('APP Instance Started successfully!');
  }

  private async initExtensions() {
    await Promise.all(
      this.options.extensions?.map(async extension => {
        try {
          const extApp = extension.app;

          // override extension logger with parent's 
          extApp.setLogger(this.logger);

          await extApp.initExtensions();
          await extApp.classLoader.load();
          extApp.components.load(extApp.classLoader.classes);
          this.components.registerExtension(extApp.components, extension.include);
        }
        catch (e) {
          throw new Error(`While trying to register Extension - ${e.message}`);
        }

      }) || []
    );
  }

  async run(stage: AppStage = AppStage.Start) {
    if (this.isRunCalled) {
      throw new Error('app.run is already called, you can\'t call it twice!');
    }
    else {
      this.isRunCalled = true;
    }

    switch (stage) {
      case AppStage.Load:
        await this.load();
        break;
      case AppStage.Init:
        await this.load();
        await this.init();
        break;
      case AppStage.Start:
        await this.load();
        await this.init();
        await this.start();
        break;
    }
  }

  async stop() {
    try {
      const hooks = this.components.getAll<IHook>(ComponentType.Hook);

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

  getCLICommands() {
    try {
      return this.components.getAll<ICLI>(ComponentType.CLI);
    }
    catch(e) {
      if (e.message !== 'No matching bindings found for serviceIdentifier: cli') {
        throw e;
      }
      else {
        return [];
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
    this.components.overrideCoreComponent(Logger, logger);
  }
}