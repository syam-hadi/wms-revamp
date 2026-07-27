import Joi from 'joi';

export const CreateCountryValidation = Joi.object({
  code: Joi.string().trim().max(5).required(),
  name: Joi.string().trim().max(150).required(),
});
