import { IInterceptor, Interceptor, Service, Use } from '@nodearch/core';

@Interceptor()
export class SimpleInterceptor implements IInterceptor {
  async handler(data: {args: any[]}) {
    console.log('SimpleInterceptor.handler', data);
  }

  before() {
    console.log('SimpleInterceptor.before');
    return true;
  }
}

@Service()
export class SimpleService {
  
  @Use(SimpleInterceptor)
  sum(x: number, y: number) {
    return x + y;
  }

  async sumAsync(x: number, y: number) {
    return new Promise((resolve, reject) => {

      setTimeout(() => {
        resolve(x + y);
      }, 1000);

    });
  }
}