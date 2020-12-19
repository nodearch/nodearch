import { Container } from 'inversify';
import { ComponentScope, ComponentType } from '../enums';
import { InterceptorResolver } from '../interceptor/interceptor-resolver';
import { ProxyFactory } from '../proxy-factory';
import { ControllerHandler } from './controller.handler';


describe('components/controller', () => {

  describe('ControllerHandler', () => {

    describe('register', () => {

      const mockedContainerBind = { toSelf: () => ({ 
          inTransientScope: () => {},
          inSingletonScope: () => {},
          inRequestScope: () => {}
        }),
        toService: () => {}
      };

      it('Should register Controller Component with no Scope', () => {
        const container = new Container();
        const serverHandler = new ControllerHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingController {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingController, { type: ComponentType.Controller });
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingController);
      });
  
      it('Should register Controller Component with Request Scope', () => {
        const container = new Container();
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
        const serverHandler = new ControllerHandler(container);
  
        class TestingController {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingController, { type: ComponentType.Controller, scope: ComponentScope.Request });
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingController);
        expect(containerBindSpy).toBeCalledWith('controller');
      });

      it('Should register Controller Component with Interceptors', () => {
        const container = new Container();
        const hasInterceptorSpy = spyOn(InterceptorResolver, 'hasInterceptors').and.returnValue(true);
        const serverHandler = new ControllerHandler(container);
  
        class TestingController {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingController, { type: ComponentType.Controller, scope: ComponentScope.Request });
  
        expect(hasInterceptorSpy).toBeCalledTimes(1);
      });
    });
  
    describe('registerExtension', () => {

      const mockedContainerBind = { toDynamicValue: () => {}, toService: () => {} };

      it('Should register Extension Controller Component with no Scope', () => {
        const container = new Container();
        const extContainer = new Container();
        const serverHandler = new ControllerHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingController {
          testingParams: string = 'test';
        }
        
        serverHandler.registerExtension(TestingController, extContainer);
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingController);
        expect(containerBindSpy).toBeCalledWith('controller');
      });
  
    });

  });
});