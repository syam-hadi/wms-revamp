import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('database.url');
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter, log: ['query'] });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
