import { ComponentInfo } from '@nodearch/core/components';
import { SqsMatching } from './enums.js';
import { Message } from '@aws-sdk/client-sqs';

export interface ISqsEventOptions {
  id: string;
  match: ISqsEventMatching[];
}

export interface IAwsSqsEventAppOptions {
  id: string;
  enabled: boolean;
  queueUrl: string;
  awsRegion?: string;
  maxNumberOfMessages?: number;
  visibilityTimeout?: number;
  waitTimeSeconds?: number;
  awsCredentials?: IAwsCredentials;
  failureBackoffMs?: number;
}

export interface ISqsEvent {
  onMessage(message: Message): Promise<void>;
} 

export interface ISqsEventHandler {
  match: ISqsEventMatching[];
  componentInfo: ComponentInfo<ISqsEvent, ISqsEventOptions>;
}

export interface ISqsEventMatching {
  path: string;
  operation: SqsMatching;
  value: any;
}

export interface IAwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}