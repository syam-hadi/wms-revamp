import { Module } from '@nestjs/common';
import { RateController } from './controllers/rate.controller';
import { RateService } from './services/rate.service';
import { RateRepository } from './repositories/rate.repository';
import { PrismaRateRepository } from './repositories/prisma-rate.repository';

@Module({
  controllers: [RateController],
  providers: [
    RateService,
    {
      provide: RateRepository,
      useClass: PrismaRateRepository,
    },
  ],
  exports: [RateService],
})
export class RateModule {}
