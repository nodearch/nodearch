export enum ComponentType {
  Component = 'component',
  Service = 'service',
  Controller = 'controller',
  Config = 'config',
  Hook = 'hook',
  Repository = 'repository',
  Interceptor = 'interceptor',
  Cli = 'cli',
  Test = 'test'
}

export enum ComponentScope {
  Request = 'Request',
  Singleton = 'Singleton',
  Transient = 'Transient'
}
