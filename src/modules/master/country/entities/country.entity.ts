import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities';

export class CountryEntity extends BaseEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;
}
