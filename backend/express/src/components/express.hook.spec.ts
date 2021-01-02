import { ComponentType } from '@nodearch/core';
import 'ts-jest';
import { ExpressHook } from './express.hook';

describe('components/express.hook', () => {
  describe('ExpressHook.onInit', () => {

    it('Should load controllers', () => {
      const expressService: any = { init() {} };
      const logger: any = { };
      const context: any = { getAll() {} };

      const expressServiceSpy = spyOn(expressService, 'init');
      const contextSpy = spyOn(context, 'getAll').and.returnValue([{}, {}]);

      const expressHook = new ExpressHook(expressService, logger);

      expressHook.onInit(context);

      expect(contextSpy).toHaveBeenCalledTimes(1);
      expect(expressServiceSpy).toHaveBeenCalledTimes(1);
      expect(contextSpy).toHaveBeenCalledWith(ComponentType.Controller);
    });

    it('Should failed to load controllers', () => {
      const expressService: any = { };
      const logger: any = { warn() {} };
      const context: any = { getAll() {} };

      const loggerSpy = spyOn(logger, 'warn');
      const contextSpy = spyOn(context, 'getAll').and.throwError('');

      const expressHook = new ExpressHook(expressService, logger);

      expressHook.onInit(context);

      expect(contextSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(contextSpy).toHaveBeenCalledWith(ComponentType.Controller);
    });
  });

  describe('ExpressHook.onStart', () => {

    it('Should start express app with controllers', () => {
      const expressService: any = { start() {} };
      const logger: any = { };

      const expressServiceSpy = spyOn(expressService, 'start');

      const expressHook: any = new ExpressHook(expressService, logger);
      expressHook.controllers = [{}];

      expressHook.onStart();

      expect(expressServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('Should not start express if no controller register', () => {
      const expressService: any = { start() {} };
      const logger: any = { };

      const expressServiceSpy = spyOn(expressService, 'start');

      const expressHook: any = new ExpressHook(expressService, logger);
      expressHook.controllers = [];
      
      expressHook.onStart();

      expect(expressServiceSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('ExpressHook.onStop', () => {

    it('Should stop express app', () => {
      const expressService: any = { stop() {} };
      const logger: any = { };

      const expressServiceSpy = spyOn(expressService, 'stop');

      const expressHook: any = new ExpressHook(expressService, logger);

      expressHook.onStop();

      expect(expressServiceSpy).toHaveBeenCalledTimes(1);
    });

  });
});