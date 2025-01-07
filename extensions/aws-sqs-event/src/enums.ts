export enum ClientSQSDecorator {
  SQSEvent = '@nodearch/aws-sqs-listener/decorators/sqs-event',
}

export enum SQSMatching {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  EXIST = 'EXIST',
  NOT_EXIST = 'NOT_EXIST'
}