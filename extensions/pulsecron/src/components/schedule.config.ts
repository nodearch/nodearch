import { Config, ConfigManager } from '@nodearch/core';
import { IPulseCronAppOptions } from '../interfaces.js';

@Config()
export class SchedulerConfig implements IPulseCronAppOptions {
  mongoConnectionString: string;

  defaultConcurrency: number;

  maxConcurrency: number;

  processEvery: string;

  resumeOnRestart: boolean;

  constructor(config: ConfigManager) {
    this.mongoConnectionString = config.env({
      key: 'SCHEDULE_MONGO_CONNECTION_STRING',
      external: 'mongoConnectionString',
      defaults: {
        all: 'mongodb://localhost:27017/pulse',
      },
    });

    this.defaultConcurrency = config.env({
      key: 'SCHEDULE_DEFAULT_CONCURRENCY',
      external: 'defaultConcurrency',
      defaults: {
        all: 2,
      },
    });

    this.maxConcurrency = config.env({
      key: 'SCHEDULE_MAX_CONCURRENCY',
      external: 'maxConcurrency',
      defaults: {
        all: 5,
      },
    });

    this.processEvery = config.env({
      key: 'SCHEDULE_PROCESS_EVERY',
      external: 'processEvery',
      defaults: {
        all: '10 seconds',
      },
    });

    this.resumeOnRestart = config.env({
      key: 'SCHEDULE_RESUME_ON_RESTART',
      external: 'resumeOnRestart',
      defaults: {
        all: true,
      },
    });
  }
}
