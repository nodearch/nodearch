// import { Container } from 'inversify';
// import { ComponentScope, ComponentType } from '../enums';
// import { ComponentHandler } from './component.handler';


// describe('components/component', () => {

//   describe('ComponentHandler', () => {

//     describe('register', () => {

//       const mockedContainerBind = { toSelf: () => ({ 
//           inTransientScope: () => {},
//           inSingletonScope: () => {},
//           inRequestScope: () => {} 
//         })
//       };
  
//       it('Should register General Component with no Scope', () => {
//         const container = new Container();
//         const serverHandler = new ComponentHandler(container);
//         const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
//         class TestingComponent {
//           testingParams: string = 'test';
//         }
        
//         serverHandler.register(TestingComponent, { type: ComponentType.Component });
  
//         expect(containerBindSpy).toBeCalledTimes(1);
//         expect(containerBindSpy).toBeCalledWith(TestingComponent);
//       });
  
//       it('Should register General Component with Request Scope', () => {
//         const container = new Container();
//         const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
//         const serverHandler = new ComponentHandler(container);
  
//         class TestingComponent {
//           testingParams: string = 'test';
//         }
        
//         serverHandler.register(TestingComponent, { type: ComponentType.Component, scope: ComponentScope.Request });
  
//         expect(containerBindSpy).toBeCalledTimes(1);
//         expect(containerBindSpy).toBeCalledWith(TestingComponent);
//       });
  
//     });

//     describe('registerExtension', () => {

//       const mockedContainerBind = { toDynamicValue: () => {} };

//       it('Should register Extension General Component with no Scope', () => {
//         const container = new Container();
//         const extContainer = new Container();
//         const serverHandler = new ComponentHandler(container);
//         const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
//         class TestingComponent {
//           testingParams: string = 'test';
//         }
        
//         serverHandler.registerExtension(TestingComponent, extContainer);
  
//         expect(containerBindSpy).toBeCalledTimes(1);
//         expect(containerBindSpy).toBeCalledWith(TestingComponent);
//       });
  
//     });
//   });
// });