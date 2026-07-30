import Joi from 'joi';

export const UpdateCurrencyValidation = Joi.object({
  name: Joi.string().trim().max(150).required(),
});
