import Joi from 'joi';

export const CreateCurrencyValidation = Joi.object({
  code: Joi.string().trim().uppercase().max(20).required(),
  name: Joi.string().trim().max(150).required(),
});
