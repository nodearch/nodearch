import 'ts-jest';
import { ConfigManager } from '@nodearch/core';
import { HttpErrorsRegistry } from './errors-registry.service';
import { ServerConfig } from './server.config';
import { BadRequest, GatewayTimeout } from '../errors';

describe('components/errors-registry.service', () => {
  describe('HttpErrorsRegistry.handleError', () => {

    it('Should Return Default Internal Server Error', () => {
      const httpErrorsRegistry = new HttpErrorsRegistry(new ServerConfig(new ConfigManager()), <any>{});
      const json: any = { json: () => {} };
      const res: any = { status: () => json }

      const responseStatusSpy = spyOn(res, 'status').and.returnValue(json);
      const responseJsonSpy = spyOn(json, 'json');

      httpErrorsRegistry.handleError(new Error('any error'), res);

      expect(responseJsonSpy).toHaveBeenCalledTimes(1);
      expect(responseStatusSpy).toBeCalledWith(500);
      expect(responseJsonSpy).toBeCalledWith({ error: 'any error' });
    });

    it('Should Return Express Error with default handler', () => {
      const httpErrorsRegistry = new HttpErrorsRegistry(new ServerConfig(new ConfigManager()), <any>{});
      const json: any = { json: () => {} };
      const res: any = { status: () => json }

      const responseStatusSpy = spyOn(res, 'status').and.returnValue(json);
      const responseJsonSpy = spyOn(json, 'json');

      httpErrorsRegistry.handleError(new BadRequest('any error'), res);

      expect(responseJsonSpy).toHaveBeenCalledTimes(1);
      expect(responseStatusSpy).toBeCalledWith(400);
      expect(responseJsonSpy).toBeCalledWith({ error: 'any error' });
    });

    it('Should Return Express Error with custom handler', () => {
      const customConfig = { httpErrorsOptions: { handler() {} } };
      const logger = <any>{};
      const httpErrorsRegistry = new HttpErrorsRegistry(
        new ServerConfig(new ConfigManager(customConfig)), logger
      );

      const errorHandlerSpy = spyOn(customConfig.httpErrorsOptions, 'handler');
      const error = new GatewayTimeout('any error');
      const res = <any> {};

      httpErrorsRegistry.handleError(error, res);

      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      expect(errorHandlerSpy).toBeCalledWith(error, res, logger);
    });

    it('Should Return custom Error with custom handler', () => {
      class CustomError extends Error {}

      const customConfig = { 
        httpErrorsOptions: { 
          handler() {},
          customErrors: [{
            error: CustomError,
            handler: () => {}
          }] 
        } 
      };


      const logger = <any>{};
      const httpErrorsRegistry = new HttpErrorsRegistry(
        new ServerConfig(new ConfigManager(customConfig)), logger
      );

      const errorHandlerSpy = spyOn(customConfig.httpErrorsOptions.customErrors[0], 'handler');
      const error = new CustomError('any error');
      const res = <any> {};

      httpErrorsRegistry.handleError(error, res);

      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      expect(errorHandlerSpy).toBeCalledWith(error, res, logger);
    });
  });
});