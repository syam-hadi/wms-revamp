import Joi from 'joi';

export const CreateProvinceValidation = Joi.object({
  countryId: Joi.string().uuid().required(),
  code: Joi.string().trim().max(5).required(),
  name: Joi.string().trim().max(150).required(),
});
