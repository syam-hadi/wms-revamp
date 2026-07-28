import { BaseEntity } from 'src/common/entities/base.entity';
import { Prisma } from '@prisma/client';

export class RateEntity extends BaseEntity {
  id: string;
  currencyCode: string;
  description: string | null;
  value: Prisma.Decimal;
  validFrom: Date;
}
