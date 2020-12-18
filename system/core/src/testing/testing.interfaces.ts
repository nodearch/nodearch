import { ClassConstructor } from '../utils';

export interface IComponentOverride {
  use: any;
  component: ClassConstructor;
}

export interface ITestingAppOptions {
  override?: [{
    use: any;
    component: ClassConstructor;
  }];
}