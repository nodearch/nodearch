import { AppContext, Logger, Service } from '@nodearch/core';
import {
  DefineOptions, JobAttributesData, Processor, Pulse,
} from '@pulsecron/pulse';
import { SchedulerConfig } from './schedule.config.js';
import { PulseDecorator } from '../enums.js';
import { IScheduledJob } from '../interfaces.js';

@Service()
export class SchedulerRegistry {
  private pulse!: Pulse;

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

    const componentsInfo = this.getScheduledJobsComponents();
  
    const jobs = componentsInfo.map(compInfo => {
      return {
        jobInstance: compInfo.getInstance() as IScheduledJob,
        jobName: compInfo.getData().name,
        jobOptions: compInfo.getData().options 
      };
    });

    console.log(jobs);
  }

  async stop() {
    await this.pulse.stop();
  }

  private getScheduledJobsComponents() {
    return this.appContext.getComponentRegistry().get({ id: PulseDecorator.JOB });
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

    this.pulse.on('cancel', (job) => {
      this.logger.info(`Job <${job.attrs.name}> cancelled`);
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
