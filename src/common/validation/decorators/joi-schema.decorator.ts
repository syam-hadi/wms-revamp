import { SetMetadata } from '@nestjs/common';
import { ObjectSchema } from 'joi';

export const JOI_SCHEMA_KEY = 'joi_schema';

export const JoiSchema = (schema: ObjectSchema): MethodDecorator =>
  SetMetadata(JOI_SCHEMA_KEY, schema);
