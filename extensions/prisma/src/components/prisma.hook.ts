import { Hook, IHook, Logger } from '@nodearch/core';
import { PrismaClient } from './prisma.service.js';


@Hook({ export: true })
export class PrismaHook implements IHook {

  constructor(
    private prisma: PrismaClient,
    private logger: Logger
  ) {}

  async onStart() {
    this.logger.info("Connecting to database...");
    await this.prisma.connect();
    this.logger.info("Connected to database");
  }

  async onStop() {
    this.logger.info("Disconnecting from database...");
    await this.prisma.disconnect();
    this.logger.info("Disconnected from database");
  }
}
