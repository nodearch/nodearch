import { AppContext, Logger, Service } from '@nodearch/core';
import {
  DefineOptions, JobAttributesData, Processor, Pulse,
} from '@pulsecron/pulse';
import { SchedulerConfig } from './schedule.config.js';
import { PulseDecorator } from '../enums.js';
import { IJobDefinition, IJobInfo } from '../interfaces.js';
import { ClassConstructor } from '@nodearch/core/utils';

@Service()
export class SchedulerRegistry {
  private pulse!: Pulse;
  private jobs: IJobInfo[] = [];

  constructor(
    private config: SchedulerConfig,
    private logger: Logger,
    private appContext: AppContext
  ) {}

  async start() {
    this.pulse = new Pulse({
      db: { address: this.config.mongoConnectionString },
      defaultConcurrency: this.config.defaultConcurrency,
      maxConcurrency: this.config.maxConcurrency,
      processEvery: this.config.processEvery,
      resumeOnRestart: this.config.resumeOnRestart
    });

    await this.pulse.start();

    this.registerLoggers();

    this.jobs = this.getJobDefinitionComponents();
    
    this.registerJobs();
  }

  async stop() {
    await this.pulse.stop();
  }

  getJobs() {
    return this.jobs;
  }

  getJobInfo(jobDefinition: ClassConstructor<IJobDefinition>) {
    return this.jobs.find(job => job.jobClass === jobDefinition);
  }

  getPulse() {
    return this.pulse;
  }

  private getJobDefinitionComponents() {
    return this.appContext
      .getComponentRegistry()
      .get({ id: PulseDecorator.JOB_DEFINITION })
      .map(compInfo => {
        return {
          jobInstance: compInfo.getInstance() as IJobDefinition,
          jobName: compInfo.getData().name,
          jobOptions: compInfo.getData().options,
          jobClass: compInfo.getClass()
        } as IJobInfo;
      });
  }

  private registerJobs() {
    this.jobs.forEach(job => {
      this.createJob(job.jobName, job.jobInstance.run.bind(job.jobInstance) as any, job.jobOptions);
      
      this.logger.info(`Registered Job <${job.jobName}> - ${job.jobInstance.constructor.name}`);
    });
  }

  private createJob(name: string, processor: Processor<JobAttributesData>, options?: DefineOptions) {
    this.pulse.define(name, processor, options);
  }

  private registerLoggers() {
    this.pulse.on('start', (job) => {
      this.logger.info(`Job <${job.attrs.name}> starting`);
    });

    this.pulse.on('success', (job) => {
      this.logger.info(`Job <${job.attrs.name}> succeeded`);
    });

    this.pulse.on('fail', (error, job) => {
      this.logger.error(`Job <${job.attrs.name}> failed:`, error);
    });

    this.pulse.on('cancel', (jobsCount) => {
      this.logger.info(`Cancelled ${jobsCount} jobs`);
    });

    this.pulse.on('complete', (job) => {
      this.logger.info(`Job <${job.attrs.name}> completed`);
    });

    this.pulse.on('error', (error) => {
      this.logger.error('Pulse Error:', error);
    });

    this.pulse.on('ready', () => {
      this.logger.info('Pulse Scheduler Ready');
    });
  }
}
