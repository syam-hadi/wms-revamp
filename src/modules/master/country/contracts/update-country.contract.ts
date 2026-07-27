import { PartialType } from '@nestjs/swagger';
import { CreateCountryContract } from './create-country.contract';

export class UpdateCountryContract extends PartialType(CreateCountryContract) {}
