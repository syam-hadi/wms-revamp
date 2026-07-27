import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';

import { CountryController } from './controllers/country.controller';
import { CountryService } from './services/country.service';
import { CountryRepository } from './repositories/country.repository';
import { PrismaCountryRepository } from './repositories/prisma-country.repository';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [CountryController],
  providers: [
    CountryService,
    {
      provide: CountryRepository,
      useClass: PrismaCountryRepository,
    },
  ],
  exports: [CountryService, CountryRepository],
})
export class CountryModule {}
