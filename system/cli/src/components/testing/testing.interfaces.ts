export interface ITestCommandOptions {
  unit?: boolean;
  e2e?: boolean;
  watch?: boolean;
  coverage?: boolean;
  open?: boolean;
  files?: string[];
  dirs?: string[];
  maxConcurrency?: number;
  maxWorkers?: number | string;
  isolatedModules?: boolean;
  verbose?: boolean; 
  runner: 'mocha';
}

export interface IMochaOptions { }