import { BaseEntity } from 'src/common/entities';

export class BankEntity extends BaseEntity {
  id!: string;
  code!: string;
  shortName!: string;
  name!: string;
}
