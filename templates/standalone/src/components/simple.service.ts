import { IInterceptor, Interceptor, Service, Use } from '@nodearch/core';

@Interceptor()
export class SimpleInterceptor implements IInterceptor {
  async handler(data: {args: any[]}) {
    console.log('SimpleInterceptor.handler', data);
  }

  before() {
    console.log('SimpleInterceptor.before');
    // throw new Error('SimpleInterceptor.before');
    // return true;
  }
}

@Interceptor()
export class SimpleInterceptor2 implements IInterceptor {
  async handler(data: {args: any[]}) {
    console.log('SimpleInterceptor2.handler', data);
  }

  before() {
    console.log('SimpleInterceptor2.before');
  }
}

@Service()
export class SimpleService {
  
  @Use(SimpleInterceptor)
  sum(x: number, y: number) {
    return x + y;
  }

  @Use(SimpleInterceptor2)
  sum2(x: number, y: number) {
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