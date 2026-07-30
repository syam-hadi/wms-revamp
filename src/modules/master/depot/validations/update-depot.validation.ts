import Joi from 'joi';

export const UpdateDepotValidation = Joi.object({
  name: Joi.string().required().trim().max(150),
  description: Joi.string().optional().trim().max(100).allow('', null),
});
