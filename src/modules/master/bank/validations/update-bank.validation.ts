import Joi from 'joi';

export const UpdateBankValidation = Joi.object({
  shortName: Joi.string().trim().max(150),
  name: Joi.string().trim().max(150),
}).min(1);
