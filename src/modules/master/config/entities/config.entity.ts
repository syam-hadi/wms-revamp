import { BaseEntity } from 'src/common/entities';
import { OptionType, Status } from 'src/common/enums';

export class ConfigEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
  description: string | null = null;
  configGroup!: string;
  optionType!: OptionType;
  status!: Status;
}
