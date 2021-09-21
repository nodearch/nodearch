export enum ComponentType {
  Component = 'component',
  Service = 'service',
  Controller = 'controller',
  Config = 'config',
  Hook = 'hook',
  Repository = 'repository',
  InterceptorProvider = 'interceptor-provider',
  CLI = 'cli'
}

export enum ComponentScope {
  Request = 'Request',
  Singleton = 'Singleton',
  Transient = 'Transient'
}

export enum AppStage {
  Load,
  Init,
  Start,
}
