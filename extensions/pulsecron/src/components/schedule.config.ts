import { Config, ConfigManager } from '@nodearch/core';
import { IPulseCronAppOptions } from '../interfaces.js';

@Config()
export class SchedulerConfig implements IPulseCronAppOptions {
  defaultConcurrency: number;

  maxConcurrency: number;

  processEvery: string;

  resumeOnRestart: boolean;

  db?: { address: string; collection?: string; options?: any; };

  disableAutoIndex?: boolean;

  defaultLockLifetime?: number;

  defaultLockLimit?: number;

  lockLimit?: number;

  sort?: any;

  mongo?: any;

  name?: string;


  constructor(config: ConfigManager) {
    this.defaultConcurrency = config.env({
      key: 'PULSE_CRON_DEFAULT_CONCURRENCY',
      external: 'defaultConcurrency'
    });

    this.maxConcurrency = config.env({
      key: 'PULSE_CRON_MAX_CONCURRENCY',
      external: 'maxConcurrency'
    });

    this.processEvery = config.env({
      key: 'PULSE_CRON_PROCESS_EVERY',
      external: 'processEvery'
    });

    this.resumeOnRestart = config.env({
      key: 'PULSE_CRON_RESUME_ON_RESTART',
      external: 'resumeOnRestart'
    });

    this.db = config.env({
      key: 'PULSE_CRON_DB',
      external: 'db'
    });

    this.disableAutoIndex = config.env({
      key: 'PULSE_CRON_DISABLE_AUTO_INDEX',
      external: 'disableAutoIndex'
    });

    this.defaultLockLifetime = config.env({
      key: 'PULSE_CRON_DEFAULT_LOCK_LIFETIME',
      external: 'defaultLockLifetime'
    });

    this.defaultLockLimit = config.env({
      key: 'PULSE_CRON_DEFAULT_LOCK_LIMIT',
      external: 'defaultLockLimit'
    });

    this.lockLimit = config.env({
      key: 'PULSE_CRON_LOCK_LIMIT',
      external: 'lockLimit'
    });

    this.sort = config.env({
      key: 'PULSE_CRON_SORT',
      external: 'sort'
    });

    this.mongo = config.env({
      key: 'PULSE_CRON_MONGO',
      external: 'mongo'
    });

    this.name = config.env({
      key: 'PULSE_CRON_NAME',
      external: 'name'
    });
  }
}
