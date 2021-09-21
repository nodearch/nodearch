import { Container } from 'inversify';
import { ComponentScope, ComponentType } from '../enums';
import { ServiceHandler } from './service.handler';

describe('components/service', () => {

  describe('ServiceHandler', () => {

    describe('register', () => {

      const mockedContainerBind = { toSelf: () => ({ 
          inTransientScope: () => {},
          inSingletonScope: () => {},
          inRequestScope: () => {} 
        })
      };

      it('Should register Service Component with no Scope', () => {
        const container = new Container();
        const serverHandler = new ServiceHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingService {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingService, { type: ComponentType.Service });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingService);
      });
  
      it('Should register Service Component with Singleton Scope', () => {
        const container = new Container();
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
        const serverHandler = new ServiceHandler(container);
  
        class TestingService {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingService, { type: ComponentType.Service, scope: ComponentScope.Singleton });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingService);
      });
    });


    describe('registerExtension', () => {

      const mockedContainerBind = { toDynamicValue: () => {} };

      it('Should register Extension Service Component with no Scope', () => {
        const container = new Container();
        const extContainer = new Container();
        const serverHandler = new ServiceHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingService {
          testingParams: string = 'test';
        }
        
        serverHandler.registerExtension(TestingService, extContainer);
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingService);
      });
  
    });

  });
});