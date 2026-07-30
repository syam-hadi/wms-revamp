import { Module } from '@nestjs/common';
import { UnitOfMeasurementController } from './controllers/unit-of-measurement.controller';
import { PrismaUnitOfMeasurementRepository } from './repositories/prisma-unit-of-measurement.repository';
import { UnitOfMeasurementRepository } from './repositories/unit-of-measurement.repository';
import { UnitOfMeasurementService } from './services/unit-of-measurement.service';

@Module({
  controllers: [UnitOfMeasurementController],
  providers: [
    UnitOfMeasurementService,
    {
      provide: UnitOfMeasurementRepository,
      useClass: PrismaUnitOfMeasurementRepository,
    },
  ],
  exports: [UnitOfMeasurementService, UnitOfMeasurementRepository],
})
export class UnitOfMeasurementModule {}
