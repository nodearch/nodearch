export interface ITestCommandOptions {
  unit?: boolean;
  e2e?: boolean;
  watch?: boolean;
  coverage?: boolean;
  open?: boolean;
  files: string[];
  dirs: string[];
}

export interface IMochaOptions { }