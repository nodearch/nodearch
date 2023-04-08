import { ComponentRegistry } from '../components/component-registry.js';
import { LogLevel } from '../log/enums.js';
import { IAppInfo } from './app.interfaces.js';
import { Container } from '../container/container.js';

  
export class AppContext {
  constructor(
    public components: ComponentRegistry,
    public container: Container,
    public appInfo: IAppInfo,
    public logLevel: LogLevel
  ) {}
}