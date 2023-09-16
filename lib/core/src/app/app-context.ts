import { Container } from '../container/container.js';
import { IAppSettings } from './app.interfaces.js';
import { ComponentRegistry } from '../components/component-registry.js';


export abstract class AppContext {
  abstract getContainer(): Container;
  abstract getComponentRegistry(): ComponentRegistry;
  abstract getSettings(): IAppSettings;
  abstract getName(): string;
}