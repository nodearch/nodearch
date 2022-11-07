import { Service } from '@nodearch/core';

@Service()
export class SimpleService {
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