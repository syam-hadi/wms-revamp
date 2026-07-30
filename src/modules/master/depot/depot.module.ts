import { Module } from '@nestjs/common';

import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { DepotController } from './controllers/depot.controller';
import { PrismaDepotRepository } from './repositories/prisma-depot.repository';
import { DepotRepository } from './repositories/depot.repository';
import { DepotService } from './services/depot.service';

@Module({
  imports: [RedisModule],
  controllers: [DepotController],
  providers: [
    DepotService,
    {
      provide: DepotRepository,
      useClass: PrismaDepotRepository,
    },
  ],
  exports: [DepotService],
})
export class DepotModule {}
