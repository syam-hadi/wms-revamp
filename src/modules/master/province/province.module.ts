import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { CountryModule } from '../country/country.module';

import { ProvinceController } from './controllers/province.controller';
import { ProvinceService } from './services/province.service';
import { ProvinceRepository } from './repositories/province.repository';
import { PrismaProvinceRepository } from './repositories/prisma-province.repository';

@Module({
  imports: [PrismaModule, RedisModule, CountryModule],
  controllers: [ProvinceController],
  providers: [
    ProvinceService,
    {
      provide: ProvinceRepository,
      useClass: PrismaProvinceRepository,
    },
  ],
  exports: [ProvinceService, ProvinceRepository],
})
export class ProvinceModule {}
