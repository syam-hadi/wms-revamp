import Joi from 'joi';

export const UpdatePortValidation = Joi.object({
  name: Joi.string().optional().trim().max(150),
});
