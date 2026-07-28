import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { CodeGeneratorModule } from 'src/common/code-generator/code-generator.module';
import { CommodityController } from './controllers/commodity.controller';
import { CommodityService } from './services/commodity.service';
import { CommodityRepository } from './repositories/commodity.repository';
import { PrismaCommodityRepository } from './repositories/prisma-commodity.repository';

@Module({
  imports: [PrismaModule, RedisModule, CodeGeneratorModule],
  controllers: [CommodityController],
  providers: [
    CommodityService,
    {
      provide: CommodityRepository,
      useClass: PrismaCommodityRepository,
    },
  ],
  exports: [CommodityService],
})
export class CommodityModule {}
