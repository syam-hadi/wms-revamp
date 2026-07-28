import Joi from 'joi';

export const CreateTaxValidation = Joi.object({
  name: Joi.string().max(150).required(),
  description: Joi.string().max(100).allow(null, '').optional(),
  value: Joi.number().precision(4).required(),
  flagType: Joi.boolean().required(),
  coa: Joi.string().max(20).allow(null, '').optional(),
  taxCode: Joi.string().max(100).allow(null, '').optional(),
});
