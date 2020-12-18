// import { describe, it } from 'mocha';
// import chai from 'chai';
// import { stub, SinonStub } from 'sinon';
// import { LoggerFactory } from './logger-factory';
// import { Logger } from './logger';
// import sinonChai from 'sinon-chai';

// const expect = chai.expect;
// chai.use(sinonChai);

// describe('application/logger/logger-factory', () => {

//   describe('LoggerFactory', () => {

//     let logStub: SinonStub<any, any>;

//     beforeEach(() => {
//       logStub = stub(console, 'log');
//     });

//     afterEach(() => {
//       logStub.restore();
//     });

//     it('Should Log default timestamp', () => {

//       const loggerFactory = new LoggerFactory();
//       const logger: Logger = loggerFactory.getLogger('test');

//       logger.error('test error');
//       expect(logStub).to.be.callCount(1);
//       expect(logStub.lastCall.args[0]).to.to.contain('\u001b[31m [ERROR] \u001b[0m [test] test error\u001b[0m');

//       logger.warn('test warn');
//       expect(logStub).to.be.callCount(2);
//       expect(logStub.lastCall.args[0]).to.to.contain('\u001b[33m [WARN] \u001b[0m [test] test warn\u001b[0m');

//       logger.debug('test debug');
//       expect(logStub).to.be.callCount(3);
//       expect(logStub.lastCall.args[0]).to.to.contain('\u001b[34m [DEBUG] \u001b[0m [test] test debug\u001b[0m');

//       logger.info('test info', { data: 1 });
//       expect(logStub).to.be.callCount(4);
//       expect(logStub.lastCall.args[0]).to.to.contain('\u001b[32m [INFO] \u001b[0m [test] test info {\n  "data": 1\n}\u001b[0m');
//     });

//     it('Should Log custom timestamp', () => {

//       const loggerFactory = new LoggerFactory({ getTimestamp: () => 'time test' });
//       const logger: Logger = loggerFactory.getLogger('test');

//       logger.error('test error');
//       expect(logStub).to.be.callCount(1);
//       expect(logStub.lastCall.args[0]).to.to.contain('time test \u001b[31m [ERROR] \u001b[0m [test] test error\u001b[0m');

//       logger.warn('test warn');
//       expect(logStub).to.be.callCount(2);
//       expect(logStub.lastCall.args[0]).to.to.contain('time test \u001b[33m [WARN] \u001b[0m [test] test warn\u001b[0m');

//       logger.debug('test debug');
//       expect(logStub).to.be.callCount(3);
//       expect(logStub.lastCall.args[0]).to.to.contain('time test \u001b[34m [DEBUG] \u001b[0m [test] test debug\u001b[0m');

//       logger.info('test info', { data: 1 });
//       expect(logStub).to.be.callCount(4);
//       expect(logStub.lastCall.args[0]).to.to.contain('time test \u001b[32m [INFO] \u001b[0m [test] test info {\n  "data": 1\n}\u001b[0m');
//     });

//     it('Should Disable log', () => {

//       const loggerFactory = new LoggerFactory({ disable: true });
//       const logger: Logger = loggerFactory.getLogger('test');

//       logger.error('test error');
//       expect(logStub).to.be.callCount(0);

//       logger.warn('test warn');
//       expect(logStub).to.be.callCount(0);

//       logger.debug('test debug');
//       expect(logStub).to.be.callCount(0);

//       logger.info('test info', { data: 1 });
//       expect(logStub).to.be.callCount(0);
//     });
//   });

// });
