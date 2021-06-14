import { Container } from 'inversify';
import { ComponentScope, ComponentType } from '../enums';
import { RepositoryHandler } from './repository.handler';


describe('components/repository', () => {

  describe('RepositoryHandler', () => {

    describe('register', () => {
      const mockedContainerBind = { toSelf: () => ({ 
          inTransientScope: () => {},
          inSingletonScope: () => {},
          inRequestScope: () => {}
        })
      };

      it('Should register Repository Component with no Scope', () => {
        const container = new Container();
        const serverHandler = new RepositoryHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingRepository {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingRepository, { type: ComponentType.Repository });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingRepository);
      });
  
      it('Should register Repository Component with Request Scope', () => {
        const container = new Container();
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
        const serverHandler = new RepositoryHandler(container);
  
        class TestingRepository {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingRepository, { type: ComponentType.Repository, scope: ComponentScope.Request });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingRepository);
      });
    });

  
    describe('registerExtension', () => {

      const mockedContainerBind = { toDynamicValue: () => {} };

      it('Should register Extension Repository Component with no Scope', () => {
        const container = new Container();
        const extContainer = new Container();
        const serverHandler = new RepositoryHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingRepository {
          testingParams: string = 'test';
        }
        
        serverHandler.registerExtension(TestingRepository, extContainer);
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingRepository);
      });
  
    });
  });
});