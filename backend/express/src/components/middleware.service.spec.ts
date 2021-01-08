import 'ts-jest';
import { ControllerMetadata } from '../metadata';
import { MiddlewareService } from './middleware.service';

describe('components/middleware.service', () => {
  describe('MiddlewareService.getMiddlewares', () => {

    it('Should get controller middlewares', () => {

      class ControllerTest {}

      spyOn(ControllerMetadata, 'getMiddlewares').and.returnValue([{}]);

      const controllerMiddlewares = (new MiddlewareService(<any> {})).getMiddlewares(ControllerTest)

      expect(controllerMiddlewares).toEqual([{}]);
    });
  });


  describe('MiddlewareService.getMethodMiddlewares', () => {

    it('Should get controller middlewares', () => {

      class MiddlewareTest {
        async handler(req: any, res: any) {}
      }
      const middleWare1 = new MiddlewareTest();
      const dependencyFactory = () => middleWare1;
      const middleware2 = (req: any, res: any) => {}

      spyOn(ControllerMetadata, 'isMiddlewareProvider').and.callFake((middleware: any) => {
        return middleware?.name === 'MiddlewareTest' ? true : false;
      });

      const methodMiddlewares = (new MiddlewareService(<any> {})).getMethodMiddlewares(
        [{
          middleware: MiddlewareTest,
          method: 'medthodOne',
        },
        {
          middleware: middleware2
        }],
        'medthodOne',
        dependencyFactory
      );

      expect(methodMiddlewares[0]).toEqual(middleware2);
      expect(methodMiddlewares.length).toEqual(2);
    });
  });

});