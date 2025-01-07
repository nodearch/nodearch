import { ComponentInfo } from '@nodearch/core/components';
import { SQSMatching } from './enums.js';
import { Message } from '@aws-sdk/client-sqs';

export interface ISQSEventOptions {
  id: string;
  match: ISQSEventMatching[];
}

export interface IAWSSQSEventOptions {
  id: string;
  enabled: boolean;
  queueUrl: string;
  awsRegion?: string;
  maxNumberOfMessages?: number;
  visibilityTimeout?: number;
  waitTimeSeconds?: number;
  awsCredentials?: IAWSCredentials;
  failuerBackoffMs?: number;
}

export interface ISQSEvent {
  onMessage(message: Message): Promise<void>;
} 

export interface ISQSEventHandler {
  match: ISQSEventMatching[];
  componentInfo: ComponentInfo<ISQSEvent, ISQSEventOptions>;
}

export interface ISQSEventMatching {
  path: string;
  operation: SQSMatching;
  value: any;
}

export interface IAWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}