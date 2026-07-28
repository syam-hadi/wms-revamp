import * as Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation/base-query.validation';

export const CreateRateValidation = Joi.object({
  currencyCode: Joi.string().uuid().required(),
  description: Joi.string().max(100).optional().allow(null, ''),
  value: Joi.number().greater(0).required(),
  validFrom: Joi.date().iso().required(),
});

export const UpdateRateValidation = Joi.object({
  currencyCode: Joi.string().uuid().optional(),
  description: Joi.string().max(100).optional().allow(null, ''),
  value: Joi.number().greater(0).optional(),
  validFrom: Joi.date().iso().optional(),
});

export const RateFilterValidation = BaseQueryValidation.append({
  currencyCode: Joi.string().uuid().optional(),
});
