import { AppStage, CLI, Component, ComponentManagement, ComponentScope, ComponentType, Controller, Hook, HookContext, ICLI, IHook, IInterceptor, IInterceptorContext, Interceptor, InterceptorProvider, Repository, Service } from '../components';
import { LogLevel } from '../logger';
import { ComponentMetadata } from '../components/component.metadata';
import { App } from './app';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('app/App', () => {

  describe('App.run', () => {
    let appPath: string;
    let componentPath: string;
    let appPackagePath: string;

    beforeAll(async () => {
      appPath = await fs.promises.mkdtemp(os.tmpdir() + path.sep);
      componentPath = path.join(appPath, 'components');
      appPackagePath = path.join(__dirname, '..');
  
      await createTestingApp(appPackagePath, appPath, componentPath);
      await createTestingController(appPackagePath, componentPath);
      await createTestingService(appPackagePath, componentPath);
    });
  
    afterAll(async () => {
      if (appPath) await fs.promises.rm(appPath, { recursive: true, force: true })
    });

    it('Should failed to create empty App with no classLoader', async () => {
      class TestApp extends App { constructor() { super({}); } };

      expect(() => new TestApp()).toThrowError();
    });

    it('Should failed to create empty App with empty Classes', async () => {
      class TestApp extends App { constructor() { super({ classLoader: { classes: [] } }); } };

      expect(() => new TestApp()).toThrowError();
    });

    it('Should successfully run App has one class by class name using "classes" option', async () => {

      @Controller()
      class TestController {}

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestController] } }); }
      }

      const testingApp = new TestApp();

      await testingApp.run(AppStage.Load);

      expect((<any> testingApp).classLoader.classes).toEqual([TestController]);
    });

    it('Should successfully run App by non-empty directory path using "classpath" option', async () => {

      class TestApp extends App {
        constructor() { super({ classLoader: { classpath: appPath } }); }
      }

      const testingApp = new TestApp();

      await testingApp.run(AppStage.Load);

      expect((<any> testingApp).classLoader.classes.length).toEqual(3)

    });

    it('Should successfully load classes from "*.ts" files in directory and exclude "*.spec.ts" files', async () => {

      await createTestingController(appPackagePath, componentPath, 'Excluded', 'spec.ts');

      class TestApp extends App {
        constructor() { 
          super({ 
            classLoader: { 
              classpath: appPath,
              files: { include: ['*.ts'], exclude: ['*.spec.ts'] }
            } 
          }); 
        }
      }

      const testingApp = new TestApp();

      await testingApp.run(AppStage.Load);

      expect((<any> testingApp).classLoader.classes.length).toEqual(3);
    });

    it('Should successfully create App with Extensions', async () => {
      @Service()
      class ExtTestService {}

      class ExtApp extends App {
        constructor() { super({ classLoader: { classes: [ExtTestService] } }); }
      }

      class TestApp extends App {
        constructor() { 
          super({ 
            classLoader: { classpath: appPath },
            extensions: [{ app: new ExtApp(), include: [ExtTestService] }]
          }); 
        }
      }

      const testingApp = new TestApp();

      await testingApp.run(AppStage.Load);

      expect((<any> testingApp).options.extensions[0].app.classLoader.classes).toEqual([ExtTestService]);
    });

    it('Should failed to register extension has invalid component', async () => {

      const invalidComponent = <any> {};

      class ExtApp extends App {
        constructor() { super({ classLoader: { classes: [invalidComponent] } }); }
      }

      class TestApp extends App {
        constructor() { super({ 
          classLoader: { classpath: appPath },
          extensions: [{ app: new ExtApp(), include: [invalidComponent] }]
        }); }
      }

      await expect((new TestApp()).run()).rejects.toThrowError();
    });

    it('Should failed to import non exiting component from extension', async () => {

      @Service()
      class NotRegisteredService {}

      @Service()
      class ValidService {}

      class ExtApp extends App {
        constructor() { super({ classLoader: { classes: [ValidService] } }); }
      }

      class TestApp extends App {
        constructor() { super({ 
          classLoader: { classpath: appPath },
          extensions: [{ app: new ExtApp(), include: [NotRegisteredService] }]
        }); }
      }

      await expect((new TestApp()).run()).rejects.toThrowError();
    });

    it('Should failed to register Extension has component not recognized as one of the supported components', async () => {

      class NotRegisteredService {}

      class ExtApp extends App {
        constructor() { super({ classLoader: { classes: [NotRegisteredService] } }); }
      }

      class TestApp extends App {
        constructor() { super({ 
          classLoader: { classpath: appPath },
          extensions: [{ app: new ExtApp(), include: [NotRegisteredService] }]
        }); }
      }

      await expect((new TestApp()).run()).rejects.toThrowError();
    });

    it('Should successfully Inject Service in Hook', async () => {

      @Repository()
      class TestRepository {}

      @Service()
      class TestService {
        constructor(private testRepository: TestRepository) {}
        getData(data: any) { return true; };
      }

      @Hook()
      class TestHook implements IHook {
        constructor(private testService: TestService) {}

        async onInit(context: HookContext) {
          context.getAll(ComponentType.Hook);
          this.testService.getData(TestHook);
        }
      }

      class TestApp extends App {
        constructor() {
          super({ classLoader: { classes: [TestService, TestRepository, TestHook] } });
        }
      }

      const spyGetData = spyOn(TestService.prototype, 'getData');

      await expect((new TestApp()).run()).resolves.toBeUndefined();
      expect(spyGetData).toHaveBeenCalledTimes(1);
      expect(spyGetData).toHaveBeenCalledWith(TestHook);
    });

    it('Should successfully Inject Repository in Service and Service in Controller', async () => {

      @Repository()
      class TestRepository1 {
        getData1(data: any) {};
      }

      @Component()
      class TestRepository2 {
        getData2(data: any) {};
      }

      @Service()
      class TestService {
        constructor(private testRepository1: TestRepository1, private testRepository2: TestRepository2) {}
        loadData() {
          this.testRepository1.getData1('test1');
          this.testRepository2.getData2('test2');
        };
      }

      @Controller()
      class TestController {
        constructor(private testService: TestService) {}
        loadData() {
          this.testService.loadData();
        };
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.loadData();
          }
        }

        async onStart(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.loadData();
          }
        }
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestController, TestService, TestRepository1, TestRepository2, TestHook] }
          });
        }
      }

      const spyGetDataRepo1 = spyOn(TestRepository1.prototype, 'getData1');
      const spyGetDataRepo2 = spyOn(TestRepository2.prototype, 'getData2');

      await expect((new TestApp()).run()).resolves.toBeUndefined();
      expect(spyGetDataRepo1).toHaveBeenCalledTimes(2);
      expect(spyGetDataRepo2).toHaveBeenCalledTimes(2);
    });

    it('Should successfully run CLI component', async () => {

      @CLI()
      class CLITest implements ICLI {
        handler(): any { return true }
        command: string = 'test'
        data: any = 'test data'
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [CLITest] }
          });
        }
      }

      const appInstance = new TestApp();

      await expect(appInstance.run()).resolves.toBeUndefined();
      expect(appInstance.getCLICommands().length).toEqual(1);
      expect(appInstance.getCLICommands()[0]?.command).toEqual('test');
      expect(appInstance.getCLICommands()[0]?.handler({})).toEqual(true);
    });

    it('Should successfully Call Controllers and CLI Components in Hook', async () => {

      @CLI()
      class CLITest implements ICLI {
        handler(): any { return true }
        command: string = 'test'
        data: any = 'test data'
      }

      @Controller()
      class TestController {
        constructor(private cliTest: CLITest) {}
        loadData() {
          this.cliTest.data;
        };
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controller = context.get<TestController>(TestController);
          controller.loadData();
        }

        async onStart(context: HookContext) {
          const cliCommands = context.findCLICommands()

          if(cliCommands) {
            for (const cliCommand of cliCommands) {
              cliCommand.handler({});
            }
          }

        }
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestController, CLITest, TestHook] }
          });
        }
      }

      const spyTestController = spyOn(TestController.prototype, 'loadData');
      const spyCLITest = spyOn(CLITest.prototype, 'handler');

      const appInstance = new TestApp();

      await expect(appInstance.run()).resolves.toBeUndefined();
      expect(spyTestController).toHaveBeenCalledTimes(1);
      expect(spyCLITest).toHaveBeenCalledTimes(1);
      expect(appInstance.getCLICommands().length).toEqual(1);
    });

    it('Should successfully Call Hooks in another Hook', async () => {

      @Hook()
      class TestHook1 implements IHook {

        async onStart(context: HookContext): Promise<any> { return true; }
      }

      @Hook()
      class TestHook2 implements IHook {

        async onInit(context: HookContext) {
          const hooks = context.findHooks();

          if(hooks) {
            for (let hook of hooks) {

              if(hook.onStart) {
                await hook.onStart(context);
              }
            }
          }
        }

        async onStart(context: HookContext): Promise<any> { return true; }
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestHook1, TestHook2] }
          });
        }
      }

      const spyOnStartTestHook1 = spyOn(TestHook1.prototype, 'onStart');
      const spyOnStartTestHook2 = spyOn(TestHook2.prototype, 'onStart');

      const appInstance = new TestApp();

      await expect(appInstance.run(AppStage.Init)).resolves.toBeUndefined();
      expect(spyOnStartTestHook1).toHaveBeenCalledTimes(1);
      expect(spyOnStartTestHook2).toHaveBeenCalledTimes(1);
    });

    it('Should failed to Call unexpected CLIs in some Hook', async () => {
        spyOn(ComponentType, 'CLI').and.returnValue('invalid_type')

      @Hook()
      class TestHook1 implements IHook {
        async onStart(context: HookContext): Promise<any> { return true; }
      }

      @Hook()
      class TestHook2 implements IHook {
        async onInit(context: HookContext) {
          context.findCLICommands();
        }
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestHook1, TestHook2] }
          });
        }
      }

      const appInstance = new TestApp();

      await expect(appInstance.run(AppStage.Init)).rejects.toThrowError();
    });

    it('Should failed to Load App with unexpected types of hooks', async () => {
      spyOn(ComponentManagement.prototype, 'getAll').and.throwError('invalid_type')

      @Hook()
      class TestHook1 implements IHook {
        async onStart(context: HookContext): Promise<any> { return true; }
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestHook1] }
          });
        }
      }

      const appInstance = new TestApp();

      await expect(appInstance.run()).rejects.toThrowError();
    });

    it('Should failed to Find Undefined Component Type in some Hook', async () => {
      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          context.getAll('anyThing')
        }
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [ TestHook] }
          });
        }
      }


      const appInstance = new TestApp();

      await expect(appInstance.run(AppStage.Init)).rejects.toThrowError();
    });

    it('Should successfully Run App with Stage Load', async () => {
      @Hook()
      class TestHook implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
      }

      @Hook()
      class TestHook2 implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestHook, TestHook2] }
          });
        }
      }

      const spyOnInit = spyOn(TestHook.prototype, 'onInit');
      const spyOnStart = spyOn(TestHook.prototype, 'onStart');
      const spyOnInit2 = spyOn(TestHook2.prototype, 'onInit');
      const spyOnStart2 = spyOn(TestHook2.prototype, 'onStart');

      await expect((new TestApp()).run(AppStage.Load)).resolves.toBeUndefined();
      expect(spyOnInit).toHaveBeenCalledTimes(0);
      expect(spyOnStart).toHaveBeenCalledTimes(0);
      expect(spyOnInit2).toHaveBeenCalledTimes(0);
      expect(spyOnStart2).toHaveBeenCalledTimes(0);
    });

    it('Should successfully Run App with Stage Init', async () => {
      @Hook()
      class TestHook implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
      }

      @Hook()
      class TestHook2 implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestHook, TestHook2] }
          });
        }
      }

      const spyOnInit = spyOn(TestHook.prototype, 'onInit');
      const spyOnStart = spyOn(TestHook.prototype, 'onStart');
      const spyOnInit2 = spyOn(TestHook2.prototype, 'onInit');
      const spyOnStart2 = spyOn(TestHook2.prototype, 'onStart');

      await expect((new TestApp()).run(AppStage.Init)).resolves.toBeUndefined();
      expect(spyOnInit).toHaveBeenCalledTimes(1);
      expect(spyOnStart).toHaveBeenCalledTimes(0);
      expect(spyOnInit2).toHaveBeenCalledTimes(1);
      expect(spyOnStart2).toHaveBeenCalledTimes(0);
    });

    it('Should successfully Run App with Stage Start', async () => {
      @Hook()
      class TestHook implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
      }

      @Hook()
      class TestHook2 implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestHook, TestHook2] }
          });
        }
      }

      const spyOnInit = spyOn(TestHook.prototype, 'onInit');
      const spyOnStart = spyOn(TestHook.prototype, 'onStart');
      const spyOnInit2 = spyOn(TestHook2.prototype, 'onInit');
      const spyOnStart2 = spyOn(TestHook2.prototype, 'onStart');
      const app = new TestApp();
      app.setLogLevel(LogLevel.Error);

      await expect((app).run(AppStage.Start)).resolves.toBeUndefined();
      expect(spyOnInit).toHaveBeenCalledTimes(1);
      expect(spyOnStart).toHaveBeenCalledTimes(1);
      expect(spyOnInit2).toHaveBeenCalledTimes(1);
      expect(spyOnStart2).toHaveBeenCalledTimes(1);
    });

    it('Should Failed to Run App Twice', async () => {
      @Repository()
      class TestRepository {}

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestRepository] } }); }
      }

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(app.run()).rejects.toThrowError();
    });
    
    it('Should successfully Stop App after Running', async () => {
      @Hook()
      class TestHook implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
        async onStop(context: HookContext) {}
      }

      @Hook()
      class TestHook2 implements IHook {
        async onInit(context: HookContext) {}
        async onStart(context: HookContext) {}
        async onStop(context: HookContext) {}
      }

      class TestApp extends App {
        constructor() {
          super({ 
            classLoader: { classes: [TestHook, TestHook2] }
          });
        }
      }

      const spyOnStop = spyOn(TestHook.prototype, 'onStop');
      const spyOnStop2 = spyOn(TestHook2.prototype, 'onStop');
      const app = new TestApp();

      await app.run(AppStage.Start);
      await app.stop();

      expect(spyOnStop).toHaveBeenCalledTimes(1);
      expect(spyOnStop2).toHaveBeenCalledTimes(1);
    });

    it('Should failed to Stop App as Hook throw Error onStop', async () => {
      @Hook()
      class TestHook implements IHook {
        async onStop(context: HookContext) { throw Error(); }
      }

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestHook] } }); }
      }

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(app.stop()).rejects.toThrowError();
    });

    it('Should Get Empty Array of ClI Commands as no registered CLIs', async () => {
      @Repository()
      class TestRepository {}

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestRepository] } }); }
      }

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(app.getCLICommands()).toEqual([]);
    });


    it('Should Register and Execute Interceptor on Controller before and after', async () => {
      @InterceptorProvider()
      class TestInterceptor1 implements IInterceptor {
        async before(context: IInterceptorContext, options: { data: number }) {
          return true;
        }

        async after(context: IInterceptorContext, options: { data: number }) {
          return true;
        }
      }

      @InterceptorProvider()
      class TestInterceptor2 implements IInterceptor {
        async before(context: IInterceptorContext) {
          return true;
        }

        async after(context: IInterceptorContext) {
          return true;
        }
      }

      @Controller()
      @Interceptor(TestInterceptor1, { data: 1 })
      class TestController {
        @Interceptor(TestInterceptor2)
        getData() {}
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.getData();
          }
        }
      }

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestInterceptor1, TestInterceptor2, TestController, TestHook] } }); }
      }

      const interceptorBeforeSpy1 = spyOn(TestInterceptor1.prototype, 'before').and.returnValue(true);
      const interceptorAfterSpy1 = spyOn(TestInterceptor1.prototype, 'after').and.returnValue(false);
      const interceptorBeforeSpy2 = spyOn(TestInterceptor2.prototype, 'before').and.returnValue(true);
      const interceptorAfterSpy2 = spyOn(TestInterceptor2.prototype, 'after');

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(interceptorBeforeSpy1).toHaveBeenCalledTimes(1);
      await expect(interceptorBeforeSpy2).toHaveBeenCalledTimes(1);
      await expect(interceptorAfterSpy1).toHaveBeenCalledTimes(1);
      await expect(interceptorAfterSpy2).toHaveBeenCalledTimes(0);
    });

    it('Should Register and Execute Empty Interceptor on Controller', async () => {
      @InterceptorProvider()
      class TestInterceptor1 {
        data = 'test';
      }

      @InterceptorProvider()
      class TestInterceptor2 {
        data = 'test';
      }

      @Controller()
      @Interceptor(<any> TestInterceptor1, { data: 1 })
      class TestController {
        @Interceptor(<any> TestInterceptor2)
        getData() {}
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.getData();
          }
        }
      }

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestInterceptor1, TestInterceptor2, TestController, TestHook] } }); }
      }

      const getDataSpy = spyOn(TestController.prototype, 'getData').and.returnValue(true);

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(getDataSpy).toHaveBeenCalledTimes(1);
    });

    it('Should Register and Execute Interceptors have only "before" on Controller', async () => {
      @InterceptorProvider()
      class TestInterceptor1 implements IInterceptor {
        async before(context: IInterceptorContext) {
          return true;
        }
      }

      @InterceptorProvider()
      class TestInterceptor2 implements IInterceptor {
        async before(context: IInterceptorContext) {
          return true;
        }
      }

      @Controller()
      @Interceptor(<any> TestInterceptor1, { data: 1 })
      class TestController {
        @Interceptor(TestInterceptor2)
        getData() {}
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.getData();
          }
        }
      }

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestInterceptor1, TestInterceptor2, TestController, TestHook] } }); }
      }

      const interceptorBeforeSpy1 = spyOn(TestInterceptor1.prototype, 'before').and.returnValue(true);
      const interceptorBeforeSpy2 = spyOn(TestInterceptor2.prototype, 'before').and.returnValue(true);
      const getDataSpy = spyOn(TestController.prototype, 'getData').and.returnValue(true);

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(interceptorBeforeSpy1).toHaveBeenCalledTimes(1);
      await expect(interceptorBeforeSpy2).toHaveBeenCalledTimes(1);
      await expect(getDataSpy).toHaveBeenCalledTimes(1);
    });

    it('Should Register and Execute Interceptors have only "after" on Controller', async () => {
      @InterceptorProvider()
      class TestInterceptor1 implements IInterceptor {
        async after(context: IInterceptorContext) {
          return true;
        }
      }
      @InterceptorProvider()
      class TestInterceptor2 implements IInterceptor {
        async after(context: IInterceptorContext) {
          return true;
        }
      }

      @Controller()
      @Interceptor(<any> TestInterceptor1, { data: 1 })
      class TestController {
        @Interceptor(TestInterceptor2)
        getData() {}
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.getData();
          }
        }
      }

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestInterceptor1, TestInterceptor2, TestController, TestHook] } }); }
      }

      const interceptorAfterSpy1 = spyOn(TestInterceptor1.prototype, 'after').and.returnValue(true);
      const interceptorAfterSpy2 = spyOn(TestInterceptor2.prototype, 'after').and.returnValue(true);
      const getDataSpy = spyOn(TestController.prototype, 'getData').and.returnValue(true);

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(interceptorAfterSpy1).toHaveBeenCalledTimes(1);
      await expect(interceptorAfterSpy2).toHaveBeenCalledTimes(1);
      await expect(getDataSpy).toHaveBeenCalledTimes(1);
    });

    it('Should Register and Execute Interceptors with no return functions', async () => {
      @InterceptorProvider()
      class TestInterceptor1 {
        async before(context: IInterceptorContext) {
        }

        async after(context: IInterceptorContext) {
          return true;
        }
      }
      @InterceptorProvider()
      class TestInterceptor2 {
        async after(context: IInterceptorContext) {
        }
      }

      @Controller()
      @Interceptor(<any> TestInterceptor1, { data: 1 })
      class TestController {
        @Interceptor(<any> TestInterceptor2)
        getData() {}
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.getData();
          }
        }
      }

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestInterceptor1, TestInterceptor2, TestController, TestHook] } }); }
      }

      const interceptorBeforeSpy1 = spyOn(TestInterceptor1.prototype, 'before');
      const interceptorAfterSpy1 = spyOn(TestInterceptor1.prototype, 'after');
      const interceptorAfterSpy2 = spyOn(TestInterceptor2.prototype, 'after');
      const getDataSpy = spyOn(TestController.prototype, 'getData').and.returnValue(true);

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(interceptorBeforeSpy1).toHaveBeenCalledTimes(1);
      await expect(interceptorAfterSpy1).toHaveBeenCalledTimes(0);
      await expect(interceptorAfterSpy2).toHaveBeenCalledTimes(0);
      await expect(getDataSpy).toHaveBeenCalledTimes(0);
    });

    it('Should Register and Skip Interceptors on class variable', async () => {
      @InterceptorProvider()
      class TestInterceptor1 {
        async before(context: IInterceptorContext) {
          return true;
        }
      }

      @Controller()
      class TestController {
        @Interceptor(<any> TestInterceptor1) getData?: string;
      }

      @Hook()
      class TestHook implements IHook {

        async onInit(context: HookContext) {
          const controllers = context.getAll<TestController>(ComponentType.Controller);
          for (const controller of controllers) {
            controller.getData;
          }
        }
      }


      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestInterceptor1, TestController, TestHook] } }); }
      }

      const interceptorBeforeSpy1 = spyOn(TestInterceptor1.prototype, 'before');

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(interceptorBeforeSpy1).toHaveBeenCalledTimes(0);
    });

    it('Should Register Component with Transient Scope', async () => {

      @Controller({ scope: ComponentScope.Transient })
      class TestController {
      }

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestController] } }); }
      }

      const app = new TestApp();

      await expect(app.run(AppStage.Start)).resolves.toBeUndefined();
    });

    it('Should Register Component with Id', async () => {

      @Component({ scope: ComponentScope.Request, id: 'group1' })
      class TestComponent1 {
        data = 'comp1'
      }

      @Controller({ scope: ComponentScope.Request, id: 'group1' })
      class TestController2 {
        data = 'controller1'
      }

      @Service({ id: 'group2' })
      class TestService1 {
        data = 'service1'
      }

      @Service()
      class TestService2 {
        load(classes: any[]) {}
      }

      @Hook()
      class TestHook1 implements IHook {
        async onStart(context: HookContext) {
          const groupOne: any[] = context.getAll('group1');
          const groupTwo: any[] = context.getAll('group2');
          const service = context.get<TestService2>(TestService2);

          service.load([groupOne.map(g => g.data), groupTwo.map(g => g.data)]);
        }
      }

      class TestApp extends App {
        constructor() { 
          super({
            classLoader: { classes: [TestComponent1, TestController2, TestHook1, TestService1, TestService2] } 
          }); 
        }
      };

      const loadClassesSpy = spyOn(TestService2.prototype, 'load');

      const app = new TestApp();

      await expect(app.run(AppStage.Start)).resolves.toBeUndefined();
      expect(loadClassesSpy).toHaveBeenCalledTimes(1);
      expect(loadClassesSpy).toHaveBeenCalledWith([['comp1', 'controller1'], ['service1']]);
    });

  });


});


async function createTestingApp(appPackagePath: string, appPath: string, componentPath: string) {
  const mainPath = path.join(appPath, 'main.ts');

  await fs.promises.mkdir(componentPath);
  await fs.promises.writeFile(mainPath, `
    import { App } from "${appPackagePath}";
    import path from 'path';

    export class TestingApp extends App {
      constructor() { 
        super({ 
          classLoader: { classpath: path.join(__dirname, './components') }
        }); 
      }
    }
  `);
}

async function createTestingController(appPackagePath: string, componentPath: string, controllerName: string = 'Test', fileExt: string = 'ts') {
  const controllerPath = path.join(componentPath, `${controllerName.toLocaleLowerCase()}.controller.${fileExt}`);

  await fs.promises.writeFile(controllerPath, `
    import { Controller } from "${appPackagePath}";
    import { TestService } from "./test.service";
    
    @Controller() 
    export class ${controllerName}Controller {
      constructor(private testService: TestService) {}
    
      getData = () => this.testService.getData();
    }
  `);
} 

async function createTestingService(appPackagePath: string, componentPath: string, serviceName: string = 'Test', fileExt: string = 'ts') {
  const servicePath = path.join(componentPath, `${serviceName.toLocaleLowerCase()}.service.${fileExt}`);

  await fs.promises.writeFile(servicePath, `
    import { Service } from "${appPackagePath}";
    
    @Service() 
    export class ${serviceName}Service {
      constructor() {}
    
      getData = () => ([]);
    }
  `);
} 



