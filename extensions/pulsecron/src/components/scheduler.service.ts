import { Logger, Service } from '@nodearch/core';
import { SchedulerRegistry } from './scheduler.registry.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { ICancelJobInputs, IGetJobsInputs, IJobDefinition } from '../interfaces.js';

@Service({ export: true })
export class SchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private logger: Logger
  ) { }

  schedule(
    when: string | Date,
    jobDefinition: ClassConstructor<IJobDefinition> | ClassConstructor<IJobDefinition>[],
    data?: any
  ) {
    const jobNames = this.getJobName(jobDefinition);

    this.schedulerRegistry.getPulse().schedule(when, jobNames, data);

    this.logger.info(`Scheduled jobs [${jobNames.join(', ')}] to run at ${when}`);
  }

  now(
    jobDefinition: ClassConstructor<IJobDefinition> | ClassConstructor<IJobDefinition>[],
    data?: any
  ) {
    const jobNames = this.getJobName(jobDefinition);

    jobNames.forEach(jobName => {
      this.schedulerRegistry.getPulse().now(jobName, data);
    });

    this.logger.info(`Scheduled jobs [${jobNames.join(', ')}] to run now`);
  }

  async getJobs(options: IGetJobsInputs) {

    if (options.jobDefinition) {
      options.query = this.resolveJobQuery(options.jobDefinition, options.query);
    }

    return this.schedulerRegistry.getPulse().jobs(options.query, options.sort, options.limit, options.skip);
  }

  async cancelJobs(options: ICancelJobInputs) {
    if (options.jobDefinition) {
      options.query = this.resolveJobQuery(options.jobDefinition, options.query);
    }

    return await this.schedulerRegistry.getPulse().cancel(options.query);
  }

  private resolveJobQuery(jobDefinition: ClassConstructor<IJobDefinition>, query: any) {
    const jobInfo = this.schedulerRegistry.getJobInfo(jobDefinition);
    
    if (!jobInfo) {
      throw new Error(`Job ${jobDefinition.name} not found in the registry`);
    }

    query = query || {};
    
    if (typeof query.name === 'string') {
      query.name = { $in: [jobInfo.jobName, query.name] };
    }
    else if (query.name && query.name.$in) {
      query.name.$in.push(jobInfo.jobName);
    }
    else if (!query.name) {
      query.name = jobInfo.jobName;
    }

    return query;
  }

  private getJobName(jobDefinition: ClassConstructor<IJobDefinition> | ClassConstructor<IJobDefinition>[]) {
    if (!Array.isArray(jobDefinition)) {
      jobDefinition = [jobDefinition];
    }

    return jobDefinition.map(job => {
      const jobInfo = this.schedulerRegistry.getJobInfo(job);
    
      if (!jobInfo) {
        throw new Error(`Job ${job.name} not found in the registry`);
      }

      return jobInfo.jobName;
    });
  }
}