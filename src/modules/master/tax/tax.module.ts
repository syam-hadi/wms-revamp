import { Module } from '@nestjs/common';

import { TaxController } from './controllers/tax.controller';
import { TaxRepository } from './repositories/tax.repository';
import { PrismaTaxRepository } from './repositories/prisma-tax.repository';
import { TaxService } from './services/tax.service';

@Module({
  controllers: [TaxController],
  providers: [
    TaxService,
    {
      provide: TaxRepository,
      useClass: PrismaTaxRepository,
    },
  ],
  exports: [TaxService, TaxRepository],
})
export class TaxModule {}
