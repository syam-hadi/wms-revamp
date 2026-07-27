import Joi from 'joi';

export const UpdateCountryValidation = Joi.object({
  name: Joi.string().trim().max(150),
}).min(1);
