import Joi from 'joi';

export const CreateDepotValidation = Joi.object({
  code: Joi.string().required().uppercase().trim().max(20),
  name: Joi.string().required().trim().max(150),
  description: Joi.string().optional().trim().max(100).allow('', null),
});
