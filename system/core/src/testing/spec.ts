import { AppStage, ComponentType, Controller, Hook, HookContext, IHook, Repository, Service } from "../components";
import { TestingApp } from './testing-app';

describe('testing/testing-app', () => {
  describe('TestingApp.mock', () => {
    it('Should Mock one Service', async () => {

      @Service()
      class TestService {
        constructor() {}
        getData() { return 'real'; };
      }
      

      class TestTestingApp extends TestingApp {
        constructor() {
          super({ classLoader: { classes: [TestService] } });
        }
      }

      class FakeService2 {
        constructor() {}
        getData() { return 'fake'; };
      }

      const testingAppInstance = new TestTestingApp();
      await testingAppInstance.run()

      const service: TestService = testingAppInstance
        .mock({ component: TestService, use: new FakeService2() })
        .get(TestService);

      expect(service.getData()).toEqual('fake');
    });

    it('Should Mock Service Dependencies', async () => {

      @Repository()
      class DependencyTestRepo {
        constructor() {}
        getData() { return 'real-repo'; };
      }
      
      @Service()
      class DependencyTestService {
        constructor() {}
        getData() { return 'real-serve'; };
      }

      
      @Service()
      class TestService {
        constructor(
          private dependencyTestService: DependencyTestService,
          private dependencyTestRepo: DependencyTestRepo
        ) {}

        loadAllData() { 
          return `${this.dependencyTestService.getData()} ${this.dependencyTestRepo.getData()}`; 
        };
      }
      

      class TestTestingApp extends TestingApp {
        constructor() {
          super({ classLoader: { classes: [TestService, DependencyTestRepo, DependencyTestService] } });
        }
      }

      class FakeTestRepo {
        constructor() {}
        getData() { return 'fake-repo'; };
      }
      
      class FakeTestService {
        constructor() {}
        getData() { return 'fake-serve'; };
      }

      const testingAppInstance = new TestTestingApp();
      await testingAppInstance.run()

      const service: TestService = testingAppInstance
        .mock([
          { component: DependencyTestRepo, use: new FakeTestRepo() },
          { component: DependencyTestService, use: new FakeTestService() }
        ])
        .get(TestService);

      expect(service.loadAllData()).toEqual('fake-serve fake-repo');

    });
  });

  describe('TestingApp.snapshot', () => {

    it('Should Failed to Run App Twice', async () => {
      @Repository()
      class TestRepository {}

      class TestApp extends TestingApp {
        constructor() { super({ classLoader: { classes: [TestRepository] } }); }
      }

      const app = new TestApp();
      await app.run(AppStage.Start);

      await expect(app.run()).rejects.toThrowError();
    });

    it('Should Snapshot Get exact same App instance', async () => {
      @Controller()
      class TestController1 {
        constructor() {}
        getData() { return 'real1'; };
      }
      

      @Controller()
      class TestController2 {
        constructor() {}
        getData() { return 'real2'; };
      }

      class TestTestingApp extends TestingApp {
        constructor() {
          super({ classLoader: { classes: [TestController1, TestController2] } });
        }
      }

      class FakeController1 {
        constructor() {}
        getData() { return 'fake'; };
      }

      const testingAppInstance = new TestTestingApp();
      await testingAppInstance.run(AppStage.Load);
      testingAppInstance.snapshot();

      const controllers: TestController1[] = testingAppInstance
        .mock({ component: TestController1, use: new FakeController1() })
        .getAll(ComponentType.Controller);

      expect(controllers.length).toEqual(2);
      expect(controllers[0].getData()).toEqual('fake');
      expect(controllers[1].getData()).toEqual('real2');
    });

    it('Should Snapshot Reset everything after restore', async () => {
      @Controller()
      class TestController1 {
        constructor() {}
        getData() { return 'real1'; };
      }
      

      @Controller()
      class TestController2 {
        constructor() {}
        getData() { return 'real2'; };
      }

      class TestTestingApp extends TestingApp {
        constructor() {
          super({ classLoader: { classes: [TestController1, TestController2] } });
        }
      }

      class FakeController1 {
        constructor() {}
        getData() { return 'fake'; };
      }

      const testingAppInstance = new TestTestingApp();
      await testingAppInstance.run(AppStage.Init);
      testingAppInstance.snapshot();

      const controllers: TestController1[] = testingAppInstance
        .mock({ component: TestController1, use: new FakeController1() })
        .getAll(ComponentType.Controller);

      testingAppInstance.restore();

      expect(controllers.length).toEqual(2);
      expect(controllers[0].getData()).toEqual('fake');
      expect(controllers[1].getData()).toEqual('real2');
    });
  });
});