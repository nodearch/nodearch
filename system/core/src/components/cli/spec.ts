import { Container } from 'inversify';
import { ComponentScope, ComponentType } from '../enums';
import { CLIHandler } from './cli.handler';


describe('components/cli', () => {

  describe('CLIHandler', () => {

    describe('register', () => {

      const mockedContainerBind = { toSelf: () => ({ 
          inTransientScope: () => {},
          inSingletonScope: () => {},
          inRequestScope: () => {}
        }),
        toService: () => {}
      };

      it('Should register CLI Component with no Scope', () => {
        const container = new Container();
        const serverHandler = new CLIHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingCLI {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingCLI, { type: ComponentType.CLI });
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingCLI);
      });
  
      it('Should register CLI Component with Request Scope', () => {
        const container = new Container();
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
        const serverHandler = new CLIHandler(container);
  
        class TestingCLI {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingCLI, { type: ComponentType.CLI, scope: ComponentScope.Request });
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingCLI);
        expect(containerBindSpy).toBeCalledWith('cli');
      });
    });

    describe('registerExtension', () => {

      const mockedContainerBind = { toDynamicValue: () => {}, toService: () => {} };

      it('Should register Extension CLI Component with no Scope', () => {
        const container = new Container();
        const extContainer = new Container();
        const serverHandler = new CLIHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingCLI {
          testingParams: string = 'test';
        }
        
        serverHandler.registerExtension(TestingCLI, extContainer);
  
        expect(containerBindSpy).toBeCalledTimes(2);
        expect(containerBindSpy).toBeCalledWith(TestingCLI);
        expect(containerBindSpy).toBeCalledWith('cli');
      });
  
    });
  });
});