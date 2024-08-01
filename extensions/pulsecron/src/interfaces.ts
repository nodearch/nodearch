import { ClassConstructor } from '@nodearch/core/utils';
import { DefineOptions, JobAttributes } from '@pulsecron/pulse';

export interface IPulseCronAppOptions {
  /**
   * Specifies the name of the job queue.
   * This can be used for identifying and managing different queues within the same application.
   * Optional.
   */
  name?: string;

  /**
   * Defines how often the job processor should poll for new jobs to process.
   * The string should be a human-readable interval, such as '5 minutes', '1 hour'.
   * Defaults to '5 seconds' if not specified.
   * Optional.
   */
  processEvery?: string;

  /**
   * The maximum number of jobs that can be processed concurrently.
   * Helps in controlling resource utilization.
   * Defaults to '20' if not specified.
   * Optional.
   */
  maxConcurrency?: number;

  /**
   * The default concurrency for jobs that do not specify their own concurrency setting.
   * Defaults to '5' if not specified.
   * Optional.
   */
  defaultConcurrency?: number;

  /**
   * Maximum number of jobs that can be locked at the same time.
   * This prevents a single worker from locking too many jobs.
   * Defaults to '0' if not specified.
   * Optional.
   */
  lockLimit?: number;

  /**
   * Default limit for the number of jobs each worker can lock simultaneously.
   * Defaults to '0' if not specified.
   * Optional.
   */
  defaultLockLimit?: number;

  /**
   * Duration in milliseconds for how long a job can be locked before it is automatically unlocked.
   * Useful for handling job crashes or stalls.
   * Defaults to 600000 ms (10 minutes).
   * Optional.
   */
  defaultLockLifetime?: number;

  /**
   * Determines the order in which jobs are selected and locked from the database.
   * For example, { nextRunAt: 1, priority: -1 } sorts by nextRunAt ascending and priority descending.
   * Optional.
   */
  sort?: any;

  /**
   * An existing MongoDB client that can be reused instead of creating a new connection.
   * Optional.
   */
  mongo?: any;

  /**
   * Configuration for the MongoDB connection if not using an existing MongoDb client.
   * Optional.
   */
  db?: {
    /**
     * The MongoDB connection URI.
     */
    address: string;

    /**
     * Specifies the MongoDB collection to use.
     * Defaults to 'pulseJobs' if not specified.
     * Optional.
     */
    collection?: string;

    /**
     * MongoDB client options.
     * Optional.
     */
    options?: any;
  };

  /**
   * If set to true, automatic indexing of job fields by the Pulse system is disabled.
   * Useful for performance tuning in production environments.
   * Defaults to false if not specified.
   * Optional.
   */
  disableAutoIndex?: boolean;

  /**
   * This config is used to ensure that jobs left unfinished due to an unexpected system shutdown or restart
   * are properly resumed once the system is back online.
   * Defaults to true if not specified.
   * Optional.
   */
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