import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigModule } from './modules/master/config/config.module';
import { CountryModule } from './modules/master/country/country.module';
import { ProvinceModule } from './modules/master/province/province.module';
import { CityModule } from './modules/master/city/city.module';
import { BankModule } from './modules/master/bank/bank.module';
import { TaxModule } from './modules/master/tax/tax.module';
import { CommodityModule } from './modules/master/commodity/commodity.module';
import { RateModule } from './modules/master/rate/rate.module';

import {
  appConfig,
  authConfig,
  databaseConfig,
  redisConfig,
  envValidationSchema,
} from './config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors';
import { GlobalExceptionFilter } from './common/filters';
import { CodeGeneratorModule } from './common/code-generator/code-generator.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, authConfig, databaseConfig, redisConfig],
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    RedisModule,
    CodeGeneratorModule,
    ConfigModule,
    CountryModule,
    ProvinceModule,
    CityModule,
    BankModule,
    TaxModule,
    CommodityModule,
    RateModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
