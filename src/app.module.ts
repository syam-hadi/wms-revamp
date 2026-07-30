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
import { CurrencyModule } from './modules/master/currency/currency.module';
import { DepotModule } from './modules/master/depot/depot.module';
import { PortModule } from './modules/master/port/port.module';
import { UnitOfMeasurementModule } from './modules/master/unit-of-measurement/unit-of-measurement.module';
import { VesselModule } from './modules/master/vessel/vessel.module';

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
    CurrencyModule,
    DepotModule,
    PortModule,
    UnitOfMeasurementModule,
    VesselModule,
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
