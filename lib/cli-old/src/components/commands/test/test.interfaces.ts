import { TestMode } from '@nodearch/core';

export interface ITestOptions {
  generalOptions: {
    mode: TestMode[];
    coverage?: boolean;
    openCoverage?: boolean;
  };
  mochaOptions: any;
  nycOptions: any;
}