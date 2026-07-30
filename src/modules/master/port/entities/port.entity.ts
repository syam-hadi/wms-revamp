import { BaseEntity } from 'src/common/entities';

export class PortEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
}
