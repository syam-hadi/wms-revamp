import { BaseEntity } from 'src/common/entities';

export class ProvinceEntity extends BaseEntity {
  id!: string;
  countryId!: string;
  code!: string;
  name!: string;
}
