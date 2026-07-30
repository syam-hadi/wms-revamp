import { BaseEntity } from 'src/common/entities';

export class DepotEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;
}
