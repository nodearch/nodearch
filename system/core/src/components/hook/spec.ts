import { Container } from 'inversify';
import { ComponentScope, ComponentType } from '../enums';
import { HookHandler } from './hook.handler';


describe('components/hook', () => {

  describe('HookHandler', () => {

    describe('register', () => {

      const mockedContainerBind = { toSelf: () => ({ 
          inTransientScope: () => {},
          inSingletonScope: () => {},
          inRequestScope: () => {}
        }),
        toService: () => {}
      };

      it('Should register Hook Component with no Scope', () => {
        const container = new Container();
        const serverHandler = new HookHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingHook {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingHook, { type: ComponentType.Hook });
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingHook);
      });
  
      it('Should register Hook Component with Request Scope', () => {
        const container = new Container();
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
        const serverHandler = new HookHandler(container);
  
        class TestingHook {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingHook, { type: ComponentType.Hook, scope: ComponentScope.Request });
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingHook);
        expect(containerBindSpy).toBeCalledWith('hook');
      });
    });


    describe('registerExtension', () => {

      const mockedContainerBind = { toDynamicValue: () => {}, toService: () => {} };

      it('Should register Extension Hook Component with no Scope', () => {
        const container = new Container();
        const extContainer = new Container();
        const serverHandler = new HookHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingHook {
          testingParams: string = 'test';
        }
        
        serverHandler.registerExtension(TestingHook, extContainer);
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingHook);
        expect(containerBindSpy).toBeCalledWith('hook');
      });
  
    });
  });
});