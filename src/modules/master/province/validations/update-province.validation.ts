import Joi from 'joi';

export const UpdateProvinceValidation = Joi.object({
  countryId: Joi.string().uuid(),
  code: Joi.string().trim().max(5),
  name: Joi.string().trim().max(150),
}).min(1);
