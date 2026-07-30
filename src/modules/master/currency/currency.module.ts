import { Module, Provider } from '@nestjs/common';
import { CurrencyService } from './services/currency.service';
import { CurrencyController } from './controllers/currency.controller';
import { CurrencyRepository } from './repositories/currency.repository';
import { PrismaCurrencyRepository } from './repositories/prisma-currency.repository';

const repositories: Provider[] = [
  {
    provide: CurrencyRepository,
    useClass: PrismaCurrencyRepository,
  },
];

const services: Provider[] = [CurrencyService];

@Module({
  controllers: [CurrencyController],
  providers: [...repositories, ...services],
  exports: [...services],
})
export class CurrencyModule {}
