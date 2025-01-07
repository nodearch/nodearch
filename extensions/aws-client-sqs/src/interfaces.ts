import { IComponentOptions } from '@nodearch/core';

export interface SQSEventOptions {
  match: Record<string, any>;
  componentOptions?: IComponentOptions;
}

export interface SQSClientOptions {
  isListening: boolean;
  awsRegion: string;
  sqsQueueUrl: string;
  maxNumberOfMessages: number;
  visibilityTimeout: number;
  waitTimeSeconds: number;
}