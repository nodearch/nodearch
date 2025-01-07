import { Config, ConfigManager } from '@nodearch/core';


@Config()
export class SQSConfig {
  isListening: boolean;
  awsRegion: string;
  sqsQueueUrl: string;
  maxNumberOfMessages: number;
  visibilityTimeout: number;
  waitTimeSeconds: number;

  constructor(config: ConfigManager) {
    this.isListening = config.env({
      external: 'isListening',
      defaults: {
        all: true
      }
    });

    this.awsRegion = config.env({
      external: 'awsRegion'
    });

    this.sqsQueueUrl = config.env({
      external: 'sqsQueueUrl'
    });

    this.maxNumberOfMessages = config.env({
      external: 'maxNumberOfMessages',
      defaults: {
        all: 10
      }
    });

    this.visibilityTimeout = config.env({
      external: 'visibilityTimeout',
      defaults: {
        all: 30
      }
    });

    this.waitTimeSeconds = config.env({
      external: 'waitTimeSeconds',
      defaults: {
        all: 20
      }
    });
  }
}

