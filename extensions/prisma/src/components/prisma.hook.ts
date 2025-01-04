import { Hook, IHook } from '@nodearch/core';
import { PrismaClient } from './prisma.service.js';


@Hook()
export class PrismaHook implements IHook {

  constructor(
    private prisma: PrismaClient
  ) {}

  async onStart() {
    await this.prisma.connect();
  }

  async onStop() {
    await this.prisma.disconnect();
  }
}
