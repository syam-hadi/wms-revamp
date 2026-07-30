import { BaseEntity } from 'src/common/entities/base.entity';
import { DecimalValue } from 'src/common/domain/value-objects';

export class CommodityEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
  hsCode!: string | null;
  category!: string;
  isHazardous!: boolean;
  imdgClass!: string | null;
  requiresReefer!: boolean;
  minTemperature!: DecimalValue | null;
  maxTemperature!: DecimalValue | null;
  remarks!: string | null;
}
