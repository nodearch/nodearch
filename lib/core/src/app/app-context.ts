import { LogLevel } from '../index.js';
import { ComponentRegistry } from '../registry/registry.js';
import { IAppInfo } from './app.interfaces.js';
import { Container } from './container.js';

  
export class AppContext {
  constructor(
    public components: ComponentRegistry,
    public container: Container,
    public appInfo: IAppInfo,
    public logLevel: LogLevel
  ) {}
}