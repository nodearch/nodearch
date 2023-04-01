export enum ComponentScope {
  REQUEST = 'Request',
  SINGLETON = 'Singleton',
  TRANSIENT = 'Transient'
}

export enum CoreDecorator {
  COMPONENT = '@nodearch/core/decorators/component',
  COMMAND = '@nodearch/core/decorators/command',
  HOOK = '@nodearch/core/decorators/hook',
  CONFIG = '@nodearch/core/decorators/config',
  SERVICE = '@nodearch/core/decorators/service',
  REPOSITORY = '@nodearch/core/decorators/repository',
  INTERCEPTOR = '@nodearch/core/decorators/interceptor',
  CONTROLLER = '@nodearch/core/decorators/controller',
  USE = '@nodearch/core/decorators/use',
}