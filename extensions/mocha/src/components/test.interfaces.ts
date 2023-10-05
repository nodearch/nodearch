import { TestMode } from '../annotation/test.enums.js';


export interface ITestOptions {
  mode: TestMode[];
  mochaOptions: any;
}