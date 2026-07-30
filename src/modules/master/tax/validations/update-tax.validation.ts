import Joi from 'joi';

export const UpdateTaxValidation = Joi.object({
  name: Joi.string().trim().max(150).optional(),
  description: Joi.string().trim().max(100).allow(null, '').optional(),
  value: Joi.number().precision(4).optional(),
  flagType: Joi.boolean().optional(),
  coa: Joi.string().trim().max(20).allow(null, '').optional(),
  taxCode: Joi.string().trim().max(100).allow(null, '').optional(),
});
