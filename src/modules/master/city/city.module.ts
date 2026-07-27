import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { ProvinceModule } from '../province/province.module';

import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { CityRepository } from './repositories/city.repository';
import { PrismaCityRepository } from './repositories/prisma-city.repository';

@Module({
  imports: [PrismaModule, RedisModule, ProvinceModule],
  controllers: [CityController],
  providers: [
    CityService,
    {
      provide: CityRepository,
      useClass: PrismaCityRepository,
    },
  ],
  exports: [CityService, CityRepository],
})
export class CityModule {}
