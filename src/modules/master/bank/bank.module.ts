import { Module } from '@nestjs/common';

import { BankController } from './controllers/bank.controller';
import { BankRepository } from './repositories/bank.repository';
import { PrismaBankRepository } from './repositories/prisma-bank.repository';
import { BankService } from './services/bank.service';

@Module({
  controllers: [BankController],
  providers: [
    BankService,
    {
      provide: BankRepository,
      useClass: PrismaBankRepository,
    },
  ],
  exports: [BankService, BankRepository],
})
export class BankModule {}
