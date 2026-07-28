import { BaseEntity } from 'src/common/entities';

export class CountryEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
}
