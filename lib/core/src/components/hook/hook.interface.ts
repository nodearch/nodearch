export interface IHook {
  onStart?(): Promise<void>;
  onStop?(): Promise<void>;
}