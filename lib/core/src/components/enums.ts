export enum ComponentScope {
  Request = 'Request',
  Singleton = 'Singleton',
  Transient = 'Transient'
}

export enum CoreAnnotation {
  Component = '@nodearch/core/component-id/component',
  Cli = '@nodearch/core/component-id/cli',
  Hook = '@nodearch/core/component-id/hook',
  Config = '@nodearch/core/component-id/config',
  Service = '@nodearch/core/component-id/service',
  Repository = '@nodearch/core/component-id/repository',
  Test = '@nodearch/core/component-id/test',
  Interceptor = '@nodearch/core/component-id/interceptor',
  Controller = '@nodearch/core/component-id/controller',
  Mock = '@nodearch/core/component-id/mock'
}