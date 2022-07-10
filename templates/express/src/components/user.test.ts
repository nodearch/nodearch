// import { Service, ComponentScope } from '@nodearch/core';
// import path from 'path'; 
// import supertest from 'supertest';
// import { ExpressServer, ExpressHook } from '@nodearch/express';
// import express from 'express';



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
//       logging: { disable: true },
//       defaultScope: ComponentScope.Singleton,
//       classLoader: { classes: [One, Two], classpath: path.join(__dirname, '..', 'components') },
//       extensions: [{ app: new ExpressServer({ expressApp }), include: [ExpressHook] }] 
//     });

//     await testingApp.run(AppStage.Start); 
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
