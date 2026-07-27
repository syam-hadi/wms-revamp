import { BaseEntity } from 'src/common/entities';

export class CityEntity extends BaseEntity {
  id!: string;
  provinceId!: string;
  code!: string;
  name!: string;
}
