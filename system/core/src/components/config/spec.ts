import { TypeParser } from './type-parser';
import { Container } from 'inversify';
import { ComponentScope, ComponentType } from '../enums';
import { ConfigHandler } from './config.handler'
import { ConfigType } from './config.enums';
import { ConfigManager } from './config-manager';

describe('application/config', () => {

  describe('TypeParser', () => {

    it('parse number using Type number', () => {
      const result = TypeParser.parse('55555', undefined, ConfigType.NUMBER);
      expect(typeof result).toEqual('number');
    });

    it('parse number using defaultValue', () => {
      const result = TypeParser.parse('55555', 0);
      expect(typeof result).toEqual('number');
    });

    it('parse string using Type String', () => {
      const result = TypeParser.parse('55555', undefined, ConfigType.STRING);
      expect(typeof result).toEqual('string');
    });

    it('parse string using defaultValue', () => {
      const result = TypeParser.parse('55555', '111');
      expect(typeof result).toEqual('string');
    });

    it('parse json using Type JSON', () => {
      const result = TypeParser.parse('{ "one": 1, "two": "2" }', undefined, ConfigType.JSON);
      expect(typeof result).toEqual('object');
    });

    it('parse json using defaultValue', () => {
      const result = TypeParser.parse('{ "one": 1, "two": "2" }', { one: 1 });
      expect(typeof result).toEqual('object');
    });

    it('parse boolean using Type JSON', () => {
      const result = TypeParser.parse('false', undefined, ConfigType.JSON);
      expect(typeof result).toEqual('boolean');
    });

    it('parse boolean using defaultValue', () => {
      const result = TypeParser.parse('false', false);
      expect(typeof result).toEqual('boolean');
    });

    it('parse date using Type Date', () => {
      const result = TypeParser.parse('01-11-2012', undefined, ConfigType.DATE);
      expect(result.getDate()).toEqual(11);
      expect(result instanceof Date).toEqual(true);
    });

    it('parse date using defaultValue', () => {
      const result = TypeParser.parse('01-11-2012', new Date());
      expect(result.getDate()).toEqual(11);
      expect(result instanceof Date).toEqual(true);
    });

    it('if no dataType or defaultValue then fallback to string', () => {
      const result = TypeParser.parse('55555');
      expect(typeof result).toEqual('string');
    });
  });

  describe('ConfigManager', () => {

    it('Should Fail Cause of Invalid External Config', () => {
      expect(() => new ConfigManager('test')).toThrowError();
    });

    it('Should Eval Config for test environment and return value of "test" in defaults', () => {
      const configManager = new ConfigManager();

      expect(configManager.env({ key: 'test', defaults: { test: 'data' } })).toEqual('data');
      expect(configManager.env({ key: 'test', defaults: { test: 'data', all: 'all' } })).toEqual('data');
    });

    it('Should Eval Config for test environment and return value of "all" in defaults', () => {
      const configManager = new ConfigManager();

      expect(configManager.env({ key: 'test', defaults: { all: 'all data' } })).toEqual('all data');
    });

    it('Should Eval Config and return its value from ENV_Vars', () => {
      const configManager = new ConfigManager();
      process.env.TestData = '{\"test\": 12}'

      expect(configManager.env({ key: 'TestData', defaults: { all: { test: true } } })).toEqual({test: 12});

      delete process.env.TestData;
    });

    it('Should Eval Config and return its value from External Config', () => {
      const configManager = new ConfigManager({ ExtData: { data: 1 } });

      expect(configManager.env({ key: 'TestData2', defaults: { all: { test: true } }, external: 'ExtData' })).toEqual({data: 1});
    });

    
    it('Should Eval Config and return undefined as key is not exits', () => {
      const configManager = new ConfigManager();

      expect(configManager.env({ key: 'TestData2', external: 'ExtData' })).toEqual(undefined);
    });

    it('Should Fail to Eval Config as key is required and not exits', () => {
      expect(() => ConfigManager.env({ key: 'TestData2', required: true })).toThrowError();
    });

  });


  describe('ConfigHandler', () => {

    describe('register', () => {

      const mockedContainerBind = { toSelf: () => ({ 
          inTransientScope: () => {},
          inSingletonScope: () => {},
          inRequestScope: () => {}
        }),
        toService: () => {}
      };

      it('Should register Config Component with no Scope', () => {
        const container = new Container();
        const serverHandler = new ConfigHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingConfig {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingConfig, { type: ComponentType.Config });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingConfig);
      });
  
      it('Should register Config Component with Request Scope', () => {
        const container = new Container();
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
        const serverHandler = new ConfigHandler(container);
  
        class TestingConfig {
          testingParams: string = 'test';
        }
        
        serverHandler.register(TestingConfig, { type: ComponentType.Config, scope: ComponentScope.Request });
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingConfig);
      });
    });

    describe('registerExtension', () => {

      const mockedContainerBind = { toDynamicValue: () => {} };

      it('Should register Extension Config Component with no Scope', () => {
        const container = new Container();
        const extContainer = new Container();
        const serverHandler = new ConfigHandler(container);
        const containerBindSpy = spyOn(container, 'bind').and.returnValue(mockedContainerBind);
  
        class TestingConfig {
          testingParams: string = 'test';
        }
        
        serverHandler.registerExtension(TestingConfig, extContainer);
  
        expect(containerBindSpy).toBeCalledTimes(1);
        expect(containerBindSpy).toBeCalledWith(TestingConfig);
      });
  
    });
  });

});


