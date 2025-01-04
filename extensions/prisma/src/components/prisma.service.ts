import { Service } from '@nodearch/core';
import { PrismaClient } from '@prisma/client';

@Service({ export: true })
export class PrismaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  getClient() {
    return this.prisma;
  }
}