import { BaseEntity } from 'src/common/entities';

export class UnitOfMeasurementEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
  unit!: string;
  description?: string | null;
}
