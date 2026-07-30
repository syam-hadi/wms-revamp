import Joi from 'joi';

export const CreatePortValidation = Joi.object({
  code: Joi.string().required().uppercase().trim().max(20),
  name: Joi.string().required().trim().max(150),
});
