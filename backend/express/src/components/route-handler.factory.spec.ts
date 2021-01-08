import 'ts-jest';
import { HTTPParam } from '../enums';
import { RouteHandlerFactory } from './route-handler.factory';

describe('components/route-handler.factory', () => {
  describe('RouteHandlerFactory.createHandler', () => {

    it('Should successfully execute created route handler', () => {

      class ControllerTest {}
      const classMethods = { methodOne: () => ({ data: 11 }) };
      const httpErrorsRegistry: any = { handleError: () => {} };
      const dependencyFactory = () => classMethods
      const req: any = { 
        params: { param1: 'param1Test', param2: 'param2Test' },
        body: { x: 1 },
        headers: { header1: 'header1Test', header2: 'header2Test' },
        query: { query1: 'query1Test' }
      };

      const res: any = { send(data: any) {} };

      const classMethodSpy = spyOn(classMethods, 'methodOne').and.returnValue({ data: 11 });

     (new RouteHandlerFactory(httpErrorsRegistry)).createHandler(
        ControllerTest,
        <any> {
          name: 'methodOne',
          params: [
            { index: 0, type: HTTPParam.REQ },
            { index: 1, type: HTTPParam.RES },
            { index: 2, type: HTTPParam.BODY },
            { index: 3, type: HTTPParam.HEADERS },
            { index: 4, type: HTTPParam.HEADERS, key: 'header2' },
            { index: 5, type: HTTPParam.PARAMS },
            { index: 6, type: HTTPParam.PARAMS, key: 'param1' },
            { index: 7, type: HTTPParam.QUERY },
            { index: 8, type: HTTPParam.QUERY, key: 'query1' }
          ]
        },
        dependencyFactory
      )(req, res);


      expect(classMethodSpy).toBeCalledWith(
        req, res, req.body, req.headers, 'header2Test', req.params, 'param1Test', req.query, 'query1Test'
      );
    });

    it('Should failed execute created route handler', () => {

      class ControllerTest {}
      const methodError = new Error('test');
      const classMethods = { methodOne: () => { throw methodError } };
      const dependencyFactory = () => classMethods;
      const httpErrorsRegistry: any = { handleError: () => {} };
      const req: any = {};
      const res: any = {};

      const handleErrorSpy = spyOn(httpErrorsRegistry, 'handleError');
  
     (new RouteHandlerFactory(httpErrorsRegistry)).createHandler(
        ControllerTest,
        <any> {
          name: 'methodOne',
          params: []
        },
        dependencyFactory
      )(req, res)

      expect(handleErrorSpy).toBeCalledWith(methodError, res);
    });
  });

});