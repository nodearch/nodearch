import { Config, ConfigManager } from '@nodearch/core';
import { MessageSystemAttributeName } from '@aws-sdk/client-sqs';
import { IAWSCredentials } from '../interfaces.js';


@Config()
export class SQSEventConfig {
  id: string;
  enabled: boolean;
  queueUrl: string;
  awsRegion?: string;
  maxNumberOfMessages: number;
  visibilityTimeout: number;
  waitTimeSeconds: number;
  awsCredentials?: IAWSCredentials;
  failuerBackoffMs?: number;
  receiveRequestAttemptId?: string;
  messageAttributeNames?: string[];
  messageSystemAttributeNames?: MessageSystemAttributeName[];

  constructor(config: ConfigManager) {
    this.id = config.env({
      external: 'id'
    });

    this.enabled = config.env({
      external: 'enabled'
    });

    this.queueUrl = config.env({
      external: 'queueUrl'
    });

    this.awsRegion = config.env({
      external: 'awsRegion'
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

    this.awsCredentials = config.env({
      external: 'awsCredentials'
    });

    this.failuerBackoffMs = config.env({
      external: 'failuerBackoffMs',
      defaults: {
        all: 5000
      }
    });

    this.receiveRequestAttemptId = config.env({
      external: 'receiveRequestAttemptId'
    });

    this.messageAttributeNames = config.env({
      external: 'messageAttributeNames'
    });

    this.messageSystemAttributeNames = config.env({
      external: 'messageSystemAttributeNames'
    });
  }
}

