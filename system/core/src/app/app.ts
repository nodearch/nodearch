import { ClassLoader } from '../loader';
import { Container } from 'inversify';
import { ComponentManager, HookContext, ComponentType, IHook, ConfigManager } from '../component';
import { IAppInfo, IAppOptions, IRunApp, IRunCli, IRunExt, IRunOptions, IRunTest, RunMode } from './app.interfaces';
import { ILogger, ILogOptions, Logger } from '../log';
import { IConfigOptions } from '../component/config/interfaces';
// import pkg from '../../package.json';
// const pkg = require('../../package.json');

export class App {
  // TODO check if we need those to be public still
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

  private async loadExtensions (enableCli: boolean) {
    if (this.extensions) {
      this.logger.debug(`Found ${this.extensions.length} Extensions!`);

      // TODO: consider making this Promise.all
      for (const extension of this.extensions) {
        try {
          await extension.run({ mode: RunMode.EXT, logger: this.logger, enableCli });
        }
        catch (e: any) {
          throw new Error(`While trying to register Extension - ${e.message}`);
        }
      }
    }
  } 

  private async loadComponents(include: ComponentType[]) {
    this.logger.info(`Load App: ${this.appInfo.name} version: ${this.appInfo.version}`);

    await this.classLoader.load();
    const { registered, hooks, exported } = this.componentManager.load(this.classLoader.classes, include);
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

  private async runExt(runOptions: IRunExt) {
    this.logger = runOptions.logger;
    
    const enabledComponents = [
      ComponentType.Component,
      ComponentType.Config,
      ComponentType.Controller,
      ComponentType.Hook,
      ComponentType.Interceptor,
      ComponentType.Repository,
      ComponentType.Service
    ];

    if (runOptions.enableCli) {
      enabledComponents.push(ComponentType.Cli);
    }

    this.loadCoreComponents();
    await this.loadExtensions(runOptions.enableCli);
    await this.loadComponents(enabledComponents);
    this.registerExtensions();
  }
  
  private async runApp(runOptions: IRunApp) {
    this.loadCoreComponents();
    await this.loadExtensions(false);
    await this.loadComponents([
      ComponentType.Cli,
      ComponentType.Component,
      ComponentType.Config,
      ComponentType.Controller,
      ComponentType.Hook,
      ComponentType.Interceptor,
      ComponentType.Repository,
      ComponentType.Service
    ]);
    this.registerExtensions();

    await this.init();
    await this.start();
  }
  
  private async runCli(runOptions: IRunCli) {
    this.logOptions === runOptions.logOptions || this.logOptions;

    this.loadCoreComponents();
    await this.loadExtensions(true);
    await this.loadComponents([
      ComponentType.Cli,
      ComponentType.Component,
      ComponentType.Config,
      ComponentType.Controller,
      ComponentType.Hook,
      ComponentType.Interceptor,
      ComponentType.Repository,
      ComponentType.Service
    ]);
    this.registerExtensions();
  }
  
  private async runTest(runOptions: IRunTest) {
    this.loadCoreComponents();
    await this.loadExtensions(false);
    await this.loadComponents([
      ComponentType.Cli,
      ComponentType.Component,
      ComponentType.Config,
      ComponentType.Controller,
      ComponentType.Hook,
      ComponentType.Interceptor,
      ComponentType.Repository,
      ComponentType.Service,
      ComponentType.Test
    ]);
    this.registerExtensions();
    
    await this.componentManager.runTests(runOptions.testRunner);
  }

  async run(runOptions: IRunOptions = { mode: RunMode.APP }) {
    switch(runOptions.mode) {
      case RunMode.APP:
        await this.runApp(runOptions);
        break;
      case RunMode.EXT:
        await this.runExt(runOptions);
        break;
      case RunMode.CLI:
        await this.runCli(runOptions);
        break;
      case RunMode.TEST:
        await this.runTest(runOptions);
        break;
    }
  }

  async stop() {
    try {
      const hooks = this.componentManager.getAll<IHook>(ComponentType.Hook);

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

  // TODO: check if we still need this
  // setLogLevel(logLevel: LogLevel) {
  //   this.logger.setLogLevel(logLevel);
  // }
}