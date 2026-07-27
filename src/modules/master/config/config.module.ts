import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';

import { ConfigController } from './controllers/config.controller';
import { ConfigService } from './services/config.service';
import { ConfigRepository } from './repositories/config.repository';
import { PrismaConfigRepository } from './repositories/prisma-config.repository';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [ConfigController],
  providers: [
    ConfigService,
    {
      provide: ConfigRepository,
      useClass: PrismaConfigRepository,
    },
  ],
  exports: [ConfigService, ConfigRepository],
})
export class ConfigModule {}
