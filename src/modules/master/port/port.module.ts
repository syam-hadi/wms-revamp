import { Module } from '@nestjs/common';

import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { PortController } from './controllers/port.controller';
import { PrismaPortRepository } from './repositories/prisma-port.repository';
import { PortRepository } from './repositories/port.repository';
import { PortService } from './services/port.service';

@Module({
  imports: [RedisModule],
  controllers: [PortController],
  providers: [
    PortService,
    {
      provide: PortRepository,
      useClass: PrismaPortRepository,
    },
  ],
  exports: [PortService],
})
export class PortModule {}
