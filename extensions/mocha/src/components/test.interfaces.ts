import { TestMode } from '../annotation/test.enums.js';


export interface ITestOptions {
  generalOptions: {
    mode: TestMode[];
    coverage?: boolean;
    openCoverage?: boolean;
  };
  mochaOptions: any;
  nycOptions: any;
}