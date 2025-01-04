import { Service } from '@nodearch/core';
import { PrismaClient as Client } from '@prisma/client';

@Service({ export: true })
export class PrismaClient {
  prisma: Client;

  constructor() {
    this.prisma = new Client();
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}