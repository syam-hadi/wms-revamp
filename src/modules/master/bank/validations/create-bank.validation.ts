import Joi from 'joi';

export const CreateBankValidation = Joi.object({
  shortName: Joi.string().trim().max(150).required(),
  name: Joi.string().trim().max(150).required(),
});
