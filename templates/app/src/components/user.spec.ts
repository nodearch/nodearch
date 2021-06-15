import { Service, TestingApp, ComponentScope } from '@nodearch/core';
import path from 'path'; 
import supertest from 'supertest';
import { ExpressServer } from '@nodearch/express';
import express from 'express';

describe('testing suite', () => {
  it('one', async () => {
    const app = await TestingApp.create(path.join(__dirname, '..', 'main'));
    console.log(app);
  });
});


// // ==============> couple classes for testing
// @Service()
// class Two { getData() { return 'original Two'; } }

// const twoMock = { getData() { return 'mock of two' } };

// @Service()
// class One { 
//   constructor(private two: Two) {} 
//   print() { return 'original print'; } 
//   getFromTwo() { return this.two.getData(); }
// }

// const oneMock = { print() { return 'mock of print' } };
// // ===========================================


// describe('test suit', () => {

//   let testingApp: TestingApp;
//   const expressApp = express();
//   expressApp.use(express.json());
//   expressApp.use(express.urlencoded({ extended: true }));

//   beforeAll(async () => {
//     testingApp = new TestingApp({
//       appInfo: {
//         name: 'Test APP',
//         version: '1.0.0'
//       },
//       log: { disable: true },
//       defaultScope: ComponentScope.Singleton,
//       classLoader: { classes: [One, Two], classpath: path.join(__dirname, '..', 'components') },
//       extensions: [new ExpressServer({ expressApp })] 
//     });

//     await testingApp.run(); 
//   });

//   beforeEach(() => {
//     testingApp.snapshot();
//   });

//   afterEach(() => {
//     testingApp.restore();
//   });

//   afterAll(async () => {
//     await testingApp.stop();
//   });

//   it('should return mock of print', () => {
//     expect(testingApp.mock({ component: One, use: oneMock }).get<One>(One).print()).toEqual('mock of print');
//   });

//   it('should return original print', () => {
//     expect(testingApp.get<One>(One).print()).toEqual('original print');
//   });

//   it('should mock sub deps', () => {
//     expect(testingApp.mock({ component: Two, use: twoMock }).get<One>(One).getFromTwo()).toEqual('mock of two');
//   });

//   it('should return original instead of mocked', () => {
//     expect(testingApp.get<One>(One).getFromTwo()).toEqual('original Two');
//   });

//   it('[e2e] test GET /users route', async () => {
//     await supertest(expressApp)
//       .get('/users')
//       .expect(200, 'Hello, World!');
//   });
// });
