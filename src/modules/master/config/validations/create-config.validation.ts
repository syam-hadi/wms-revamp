import Joi from 'joi';

import { OptionType, Status } from 'src/common/enums';

export const CreateConfigValidation = Joi.object({
  name: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().allow('').optional(),
  configGroup: Joi.string().trim().max(100).required(),
  optionType: Joi.string()
    .valid(...Object.values(OptionType))
    .required(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .required(),
});
