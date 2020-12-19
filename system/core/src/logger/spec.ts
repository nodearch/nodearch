import { ConsoleLogger } from './console-logger';
import { Color, LogLevel } from './enums';
import { Logger } from './logger';


describe('application/logger', () => {
  let logStub: jasmine.Spy;

  beforeEach(() => {
    logStub = spyOn(console, 'log');
  });

  describe('ConsoleLogger', () => {

    it('Should Log with Default Config', () => {

      const logger = new ConsoleLogger();

      logger.log(Color.bgBlue, 'Test', ['data', 123]);

      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[44mTest\x1b[0m] data 123\x1b[0m'));
    });

    it('Should Log Stringified Object', () => {

      const logger = new ConsoleLogger();

      logger.log(Color.bgBlue, 'Test', ['data', { Data: { isTrue: true } }]);

      expect(logStub).toBeCalledWith(expect.stringContaining(`[\x1b[44mTest\x1b[0m] data ${JSON.stringify({ Data: { isTrue: true } }, null, 2)}`));
    });

    it('Should Log Error Stack', () => {

      const logger = new ConsoleLogger();

      logger.log(Color.bgBlue, 'Test', ['data', new Error('Test Error')]);

      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[44mTest\x1b[0m] data Error: Test Error'));
      expect(logStub).toBeCalledWith(expect.stringContaining('Object.asyncJestTest'));
    });

    
    it('Should Log with Custom TimeStamp', () => {

      const logger = new ConsoleLogger({ getTimestamp: () => 'FakeTimeStamp' });

      logger.log(Color.bgBlue, 'Test', ['data', 123]);

      expect(logStub).toBeCalledWith(expect.stringContaining('[\u001B[36mFakeTimeStamp\x1b[0m] [\x1b[44mTest\x1b[0m] data 123\x1b[0m'));
    });

    it('Should Log without Colors', () => {

      const logger = new ConsoleLogger({ disableColors: true });

      logger.log(Color.bgBlue, 'Test', ['data', 123]);

      expect(logStub).toBeCalledWith(expect.stringContaining('Test data 123'));
    });

    it('Should Disable Logger', () => {

      const logger = new ConsoleLogger({ disable: true });

      logger.log(Color.bgBlue, 'Test', ['data', 123]);

      expect(logStub).toBeCalledTimes(0)
    });

  });

  describe('Logger', () => {
    it('Should Log error', () => {

      const logger = new Logger(new ConsoleLogger());

      logger.error('data', 123);

      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[31mERROR\x1b[0m] data 123\x1b[0m'));
    });

    it('Should Log warn', () => {

      const logger = new Logger(new ConsoleLogger());

      logger.warn('data', 123);

      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[33mWARN\x1b[0m] data 123\x1b[0m'));
    });

    it('Should Log info', () => {

      const logger = new Logger(new ConsoleLogger());

      logger.info('data', 123);

      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[32mINFO\x1b[0m] data 123\x1b[0m'));
    });

    it('Should Log debug', () => {

      const logger = new Logger(new ConsoleLogger());
      logger.setLogLevel(LogLevel.Debug)

      logger.debug('data', 123);

      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[34mDEBUG\x1b[0m] data 123\x1b[0m'));
    });

    it('Should disable Debug for log lvl Info', () => {

      const logger = new Logger(new ConsoleLogger(), LogLevel.Info);

      logger.debug('data', 123);
      logger.info('data', 123);
      logger.warn('data', 123);
      logger.error('data', 123);
  
      expect(logStub).toBeCalledTimes(3);
      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[32mINFO\x1b[0m] data 123\x1b[0m'));
      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[33mWARN\x1b[0m] data 123\x1b[0m'));
      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[31mERROR\x1b[0m] data 123\x1b[0m'));

    });

    it('Should disable Debug & Info for log lvl Warn', () => {

      const logger = new Logger(new ConsoleLogger(), LogLevel.Warn);

      logger.debug('data', 123);
      logger.info('data', 123);
      logger.warn('data', 123);
      logger.error('data', 123);

      expect(logStub).toBeCalledTimes(2);
      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[33mWARN\x1b[0m] data 123\x1b[0m'));
      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[31mERROR\x1b[0m] data 123\x1b[0m'));
    });

    it('Should disable Debug, Info, Warn for log lvl Error', () => {

      const logger = new Logger(new ConsoleLogger(), LogLevel.Error);

      logger.debug('data', 123);
      logger.info('data', 123);
      logger.warn('data', 123);
      logger.error('data', 123);

      expect(logStub).toBeCalledTimes(1);
      expect(logStub).toBeCalledWith(expect.stringContaining('[\x1b[31mERROR\x1b[0m] data 123\x1b[0m'));
    });

  })

});
