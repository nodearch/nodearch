import 'ts-jest';
import { ConfigManager } from '@nodearch/core';
import { ExpressService } from './express.service';
import { ServerConfig } from './server.config';

describe('components/express.service', () => {
  describe('ExpressService.init', () => {

    it('Should register express controllers', () => {
      const routesService: any = { registerController() {}};
      const dependencyFactory = () => {};
      const registerControllerSpy = spyOn(routesService, 'registerController');
      const serverConfig = new ServerConfig(new ConfigManager());
      serverConfig.expressApp = <any> {};
      const controllers = [{}, {}];

      const expressService = new ExpressService(serverConfig, <any> {}, routesService);
      expressService.init(controllers, dependencyFactory)

      expect(registerControllerSpy).toHaveBeenCalledTimes(2);
      expect(registerControllerSpy).toHaveBeenCalledWith(controllers[0], serverConfig.expressApp, dependencyFactory);
      expect(registerControllerSpy).toHaveBeenCalledWith(controllers[0], expressService.express, dependencyFactory);
      expect(registerControllerSpy).toHaveBeenCalledWith(controllers[1], expressService.express, dependencyFactory);
    });

  });

  describe('ExpressService.start', () => {

    it('Should start express successfully', async () => {
      const routesService: any = {};
      const serverConfig = new ServerConfig(new ConfigManager());
      const logger: any = { info() {} };

      const expressService: any = new ExpressService(serverConfig, logger, routesService);
      expressService.server = { listen() { }, on(event: any, func: any) { if (event === 'listening') func(); } };

      const listenSpy = spyOn(expressService.server, 'listen');
      const loggerSpy = spyOn(logger, 'info');

      await expressService.start();

      expect(listenSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(listenSpy).toHaveBeenCalledWith(serverConfig.port, serverConfig.hostname);
    });

    it('Should failed to start express successfully', async () => {
      const routesService: any = {};
      const serverConfig = new ServerConfig(new ConfigManager());
      const logger: any = { info() {} };

      const expressService: any = new ExpressService(serverConfig, logger, routesService);
      expressService.server = { listen() { }, on(event: any, func: any) { if (event === 'error') func(); } };

      const listenSpy = spyOn(expressService.server, 'listen');
      const loggerSpy = spyOn(logger, 'info');


      await expect(expressService.start()).rejects.toBeUndefined();
      expect(listenSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledTimes(0);
    });

  });

  describe('ExpressService.stop', () => {

    it('Should stop express app', () => {
      const routesService: any = {};
      const serverConfig = new ServerConfig(new ConfigManager());
      serverConfig.expressApp = <any> {};

      const expressService: any = new ExpressService(serverConfig, <any> {}, routesService);
      expressService.server = { close() { } };
      const closeExpressSpy = spyOn(expressService.server, 'close');

      expressService.stop();

      expect(closeExpressSpy).toHaveBeenCalledTimes(1);
    });

  });

});