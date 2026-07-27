import { PartialType } from '@nestjs/swagger';
import { CreateCityContract } from './create-city.contract';

export class UpdateCityContract extends PartialType(CreateCityContract) {}
