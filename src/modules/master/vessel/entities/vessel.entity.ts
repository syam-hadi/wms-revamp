import { BaseEntity } from 'src/common/entities';
import { DecimalValue } from 'src/common/domain/value-objects';

export class VesselEntity extends BaseEntity {
  id!: string;
  name!: string;
  imoNumber!: string;
  callSign!: string | null;
  grossTonnage!: number | null;
  teuCapacity!: number | null;
  loaMeters!: DecimalValue | null;
}
