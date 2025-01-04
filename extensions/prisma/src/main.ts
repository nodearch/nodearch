import { App } from '@nodearch/core';


export class PrismaApp extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: {
        prefix: 'Prisma'
      }
    });
  }
}