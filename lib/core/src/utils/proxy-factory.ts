export interface IProxyMethodOptions {
  target: any;
  before?(methodName: string, args: any[], paramTypes: string[]): Promise<boolean>;
  after?(methodName: string, args: any[], paramTypes: string[]): Promise<boolean>;
}

export abstract class ProxyFactory {
  static proxyMethodCall(options: IProxyMethodOptions) {

    const handler = {
      get: function (target: any, propKey: string) {
        const originalMethod = target[propKey];

        if (typeof originalMethod === 'function' && propKey !== 'constructor') {
          // TODO: move to the Metadata classes
          const paramTypes = (<string[]>Reflect.getMetadata('design:paramtypes', target, propKey)) || [];

          // TODO: will it always be a promise?
          return async function (...args: any) {
            let result, state = true;

            if (options.before) {
              state = await options.before(propKey, args, paramTypes);
            }

            if (state) {
              result = await originalMethod.apply(target, args);
            }

            if (options.after && state) {
              await options.after(propKey, args, paramTypes);
            }

            return result;
          }
        }
        else {
          return originalMethod;
        }
      }
    };

    return new Proxy(options.target, handler);
  }
}