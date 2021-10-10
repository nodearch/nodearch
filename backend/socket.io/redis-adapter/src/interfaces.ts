export interface IRedisProviderInstance {
  getClient(): any;
}

export interface IRedisProvider {
  new(): IRedisProviderInstance;
}