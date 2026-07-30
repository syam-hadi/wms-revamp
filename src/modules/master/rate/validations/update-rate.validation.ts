import Joi from 'joi';

export const UpdateRateValidation = Joi.object({
  currencyCode: Joi.string().uuid().optional(),
  description: Joi.string().trim().max(100).optional().allow(null, ''),
  value: Joi.number().greater(0).optional(),
  validFrom: Joi.date().iso().optional(),
});
