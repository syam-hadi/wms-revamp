import { Prisma } from '@prisma/client';
import { BaseEntity } from 'src/common/entities';

export class TaxEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;
  value!: Prisma.Decimal | number;
  flagType!: boolean;
  coa!: string | null;
  taxCode!: string | null;
}
