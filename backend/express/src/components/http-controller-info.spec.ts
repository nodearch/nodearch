import 'ts-jest';
import { ControllerMetadata } from '../metadata';
import { HttpControllerInfo } from './http-controller-info';
import { HttpBody, HttpGet, HttpParams, HttpPath} from '../decorators';
import { ClassInfo, Controller } from '@nodearch/core';
import { HTTPParam } from '../enums';

describe('components/http-controller-info', () => {
  describe('HttpControllerInfo.parse', () => {

    it('Should get controller info', () => {

      @Controller()
      @HttpPath('test')
      class ControllerTest {
        @HttpGet(':id')
        methodOne(@HttpBody() req: any, @HttpParams() params: any) {}
      }

      const controllerInfo = new HttpControllerInfo();

      spyOn(ControllerMetadata, 'getHttpPrefix').and.returnValue('test');
      spyOn(ClassInfo, 'getMethods').and.returnValue(['methodOne']);
      spyOn(ControllerMetadata, 'getHttpInfo').and.returnValue({ httpMethod: 'test', httpPath: '/:id' });
      spyOn(ControllerMetadata, 'getHttpParamsInfo').and.returnValue([
        {
          index: 0,
          type: HTTPParam.BODY
        },
        {
          index: 0,
          type: HTTPParam.PARAMS,
          key: 'test'
        }
      ]);

      const controller = controllerInfo.parse(ControllerTest);

      expect(controller).toEqual({ 
        methods: [{
          name: 'methodOne',
          httpMethod: 'test',
          httpPath: 'test/:id',
          params: [
            { index: 0, type: HTTPParam.BODY },
            { index: 0, type: HTTPParam.PARAMS, key: 'test' }
          ]
        }]
      });
    });
  });


});