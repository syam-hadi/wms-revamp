import Joi from 'joi';

export const UpdateTaxValidation = Joi.object({
  name: Joi.string().max(150).optional(),
  description: Joi.string().max(100).allow(null, '').optional(),
  value: Joi.number().precision(4).optional(),
  flagType: Joi.boolean().optional(),
  coa: Joi.string().max(20).allow(null, '').optional(),
  taxCode: Joi.string().max(100).allow(null, '').optional(),
});
