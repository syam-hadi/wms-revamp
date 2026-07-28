import { BaseEntity } from 'src/common/entities';
import { DecimalValue } from 'src/common/domain/value-objects';

export class TaxEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;
  value!: DecimalValue;
  flagType!: boolean;
  coa!: string | null;
  taxCode!: string | null;
}
