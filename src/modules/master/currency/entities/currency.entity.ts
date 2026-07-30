import { BaseEntity } from 'src/common/entities';

export class CurrencyEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
}
