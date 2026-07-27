import Joi from 'joi';

export const UpdateCityValidation = Joi.object({
  provinceId: Joi.string().uuid(),
  code: Joi.string().trim().max(20),
  name: Joi.string().trim().max(150),
}).min(1);
