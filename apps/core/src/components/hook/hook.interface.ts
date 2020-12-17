import { HookContext } from './hook-context';

export interface IHook {
  onInit?(context: HookContext): Promise<void>;
  onStart?(context: HookContext): Promise<void>;
  onStop?(context: HookContext): Promise<void>;
}