import Joi from 'joi';

export const CreateRateValidation = Joi.object({
  currencyCode: Joi.string().uuid().required(),
  description: Joi.string().trim().max(100).optional().allow(null, ''),
  value: Joi.number().greater(0).required(),
  validFrom: Joi.date().iso().required(),
});
