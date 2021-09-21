import { Container } from 'inversify';
import { Controller } from '../controller';
import { ComponentScope, ComponentType } from '../enums';
import { InterceptorResolver } from './interceptor-resolver';
import { Interceptor, InterceptorProvider } from './interceptor.annotation';
import { InterceptorProviderHandler } from './interceptor.handler';


describe('components/interceptor', () => {

  describe('InterceptorProviderHandler', () => {

    describe('register', () => {
      const mockedContainerBind = { toSelf: () => ({ 
          inTransientScope: () => {},
          inSingletonScope: () => {},
          inRequestScope: () => {} 
        })
      };

      it('Should register Interceptor Component with no Scope', () => {
        const container = new Container();
        const serverHandler = new InterceptorProviderHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingInterceptor {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingInterceptor, { type: ComponentType.InterceptorProvider });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingInterceptor);
      });
  
      it('Should register Interceptor Component with Singleton Scope', () => {
        const container = new Container();
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
        const serverHandler = new InterceptorProviderHandler(container);
  
        class TestingInterceptor {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingInterceptor, { type: ComponentType.InterceptorProvider, scope: ComponentScope.Singleton });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingInterceptor);
      });
    });

    describe('registerExtension', () => {

      const mockedContainerBind = { toDynamicValue: () => {} };

      it('Should register Extension Interceptor Component with no Scope', () => {
        const container = new Container();
        const extContainer = new Container();
        const serverHandler = new InterceptorProviderHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingInterceptor {
          testingParams: string = 'test';
        }
        
        serverHandler.registerExtension(TestingInterceptor, extContainer);
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingInterceptor);
      });
  
    });
  });


  describe('InterceptorResolver', () => {
    describe('hasInterceptors', () => {
      it('Should Return False for Controller has no Interceptors', () => {
        class TestController {}

        const hasInterceptors = InterceptorResolver.hasInterceptors(TestController);

        expect(hasInterceptors).toEqual(false);
      });

      it('Should Return True for Controller has One Interceptor', () => {

        @InterceptorProvider()
        class TestInterceptor {}

        @Controller()
        @Interceptor(TestInterceptor)
        class TestController {}

        const hasInterceptors = InterceptorResolver.hasInterceptors(TestController);

        expect(hasInterceptors).toEqual(true);
      });
    });

    describe('getControllerInterceptors', () => {
      it('Should Return undefined for Controller has no Interceptors', () => {
        class TestController {}
        const container = new Container()

        const controllerInterceptors = InterceptorResolver.getControllerInterceptors(TestController, container);

        expect(controllerInterceptors).toEqual(undefined);
      });

      it('Should Return True for Controller has One Interceptor', () => {

        @InterceptorProvider()
        class TestInterceptor {}

        @InterceptorProvider()
        class TestInterceptor2 {}

        @Controller()
        @Interceptor(TestInterceptor)
        class TestController {
      
          @Interceptor(TestInterceptor2)
          test() {}
        }

        const container = new Container();
        const getSpy = spyOn(container, 'get').and.returnValue({ before: () => {}, after: () => {} });

        const controllerInterceptors = InterceptorResolver.getControllerInterceptors(TestController, container);

        expect(controllerInterceptors?.test).toHaveProperty('after');
        expect(controllerInterceptors?.test).toHaveProperty('before');
        expect(getSpy).toHaveBeenCalledTimes(2);
      });
    });
  });
});