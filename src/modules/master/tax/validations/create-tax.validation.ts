import Joi from 'joi';

export const CreateTaxValidation = Joi.object({
  name: Joi.string().trim().max(150).required(),
  description: Joi.string().trim().max(100).allow(null, '').optional(),
  value: Joi.number().precision(4).required(),
  flagType: Joi.boolean().required(),
  coa: Joi.string().trim().max(20).allow(null, '').optional(),
  taxCode: Joi.string().trim().max(100).allow(null, '').optional(),
});
