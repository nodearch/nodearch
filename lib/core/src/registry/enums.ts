export enum ComponentScope {
  Request = 'Request',
  Singleton = 'Singleton',
  Transient = 'Transient'
}

export enum CoreAnnotation {
  Component = '@nodearch/core/annotation/component',
  Command = '@nodearch/core/annotation/command',
  Hook = '@nodearch/core/annotation/hook',
  Config = '@nodearch/core/annotation/config',
  Service = '@nodearch/core/annotation/service',
  Repository = '@nodearch/core/annotation/repository',
  Interceptor = '@nodearch/core/annotation/interceptor',
  Controller = '@nodearch/core/annotation/controller',
}