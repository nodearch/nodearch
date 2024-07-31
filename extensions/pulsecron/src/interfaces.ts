import { Job, JobAttributesData, Processor } from '@pulsecron/pulse';

export interface IPulseCronAppOptions {
  mongoConnectionString?: string;
  defaultConcurrency?: number;
  maxConcurrency?: number;
  processEvery?: string;
  resumeOnRestart?: boolean;
}

export interface IScheduledJob<T = any> {
  run(job: T): Promise<void>;
}