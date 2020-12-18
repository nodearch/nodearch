export interface ITestCommandOptions {
  unit?: boolean;
  e2e?: boolean;
  watch?: boolean;
  coverage?: boolean;
  open?: boolean;
}

export interface IMochaOptions { }