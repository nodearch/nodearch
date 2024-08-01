import { ClassConstructor } from '@nodearch/core/utils';
import { DefineOptions, JobAttributes } from '@pulsecron/pulse';

export interface IPulseCronAppOptions {
  mongoConnectionString?: string;
  defaultConcurrency?: number;
  maxConcurrency?: number;
  processEvery?: string;
  resumeOnRestart?: boolean;
}

export interface IJobDefinition {
  run(job: JobAttributes): Promise<void>;
}

export interface IJobInfo {
  jobInstance: IJobDefinition;
  jobName: string;
  jobOptions?: DefineOptions;
  jobClass: ClassConstructor<IJobDefinition>;
}

export interface IGetJobsInputs {
  jobDefinition?: ClassConstructor<IJobDefinition>;
  query?: any;
  sort?: any | string;
  limit?: number;
  skip?: number;
}

export interface ICancelJobInputs {
  jobDefinition?: ClassConstructor<IJobDefinition>;
  query?: any;
}