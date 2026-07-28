import { BaseEntity } from 'src/common/entities/base.entity';

export class CommodityEntity extends BaseEntity {
  id: string;
  code: string;
  name: string;
  hsCode: string | null;
  category: string;
  isHazardous: boolean;
  imdgClass: string | null;
  requiresReefer: boolean;
  minTemperature: number | null;
  maxTemperature: number | null;
  remarks: string | null;
}
