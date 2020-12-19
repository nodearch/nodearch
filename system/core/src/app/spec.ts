import { AppStage, CLI, ComponentType, Controller, Hook, HookContext, ICLI, IHook, IInterceptor, IInterceptorContext, Interceptor, InterceptorProvider, Repository, Service } from '../components';
import { App } from './app';
import path from 'path';
import { LogLevel } from '../logger';

@Service()
export class GTestService {}

@Controller()
export class GTestController {constructor(private service: GTestService) {}}

describe('app/App', () => {

  describe('App.run', () => {

    it('Should successfully create App with one class', async () => {
      @Controller()
      class TestController {}

      class TestApp extends App {
        constructor() { super({ classLoader: { classes: [TestController] } }); }
      }

      await expect((new TestApp()).run()).resolves.toEqual(undefined);
    });

    it('Should successfully create App by load classes by path', async () => {
      class TestApp extends App {
        constructor() { super({ classLoader: { classpath: path.join(__dirname, './') } }); }
      }

      await expect((new TestApp()).run()).resolves.toEqual(undefined);
    });

    it('Should successfully create App with Extensions', async () => {
      @Service()
      class TestService {}

      class ExtApp extends App {
        constructor() { super({ classLoader: { classes: [TestService] } }); }
      }

      class TestApp extends App {
        constructor() { super({ 
          classLoader: { classpath: path.join(__dirname, './') },
          extensions: [{ app: new ExtApp(), include: [TestService] }]
        }); }
      }

      await expect((new TestApp()).run()).resolves.toEqual(undefined);
    });

    it('Should fail to create empty App with no Classes', async () => {
      expect(class TestApp extends App { constructor() { super(); } }).toThrowError();
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

      await expect((new TestApp()).run()).resolves.toEqual(undefined);
      expect(spyGetData).toHaveBeenCalledTimes(1);
      expect(spyGetData).toHaveBeenCalledWith(TestHook);
    });

    it('Should successfully Inject Repository > Service > Controller', async () => {

      @Repository()
      class TestRepository1 {
        getData1(data: any) {};
      }

      @Repository()
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

      await expect((new TestApp()).run()).resolves.toEqual(undefined);
      expect(spyGetDataRepo1).toHaveBeenCalledTimes(2);
      expect(spyGetDataRepo2).toHaveBeenCalledTimes(2);
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

      await expect((new TestApp()).run(AppStage.Load)).resolves.toEqual(undefined);
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

      await expect((new TestApp()).run(AppStage.Init)).resolves.toEqual(undefined);
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

      await expect((app).run(AppStage.Start)).resolves.toEqual(undefined);
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

    it('Should failed to Stop App has Hook cause Error onStop', async () => {
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


    it('Should Register Interceptor on Controller before and after', async () => {
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


  });
});


