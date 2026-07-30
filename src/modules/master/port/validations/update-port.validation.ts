import * as Joi from 'joi';

export const UpdatePortValidation = Joi.object({
  name: Joi.string().required().trim().max(150),
});
