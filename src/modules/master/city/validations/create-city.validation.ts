import Joi from 'joi';

export const CreateCityValidation = Joi.object({
  provinceId: Joi.string().uuid().required(),
  code: Joi.string().trim().max(20).required(),
  name: Joi.string().trim().max(150).required(),
});
