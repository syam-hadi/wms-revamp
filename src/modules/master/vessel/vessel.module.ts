import { Module } from '@nestjs/common';

import { VesselController } from './controllers/vessel.controller';
import { PrismaVesselRepository } from './repositories/prisma-vessel.repository';
import { VesselRepository } from './repositories/vessel.repository';
import { VesselService } from './services/vessel.service';

@Module({
  controllers: [VesselController],
  providers: [
    VesselService,
    {
      provide: VesselRepository,
      useClass: PrismaVesselRepository,
    },
  ],
  exports: [VesselService],
})
export class VesselModule {}
