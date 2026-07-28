import { BaseEntity } from 'src/common/entities/base.entity';
import { DecimalValue } from 'src/common/domain/value-objects';

export class RateEntity extends BaseEntity {
  id: string;
  currencyCode: string;
  description: string | null;
  value: DecimalValue;
  validFrom: Date;
}
