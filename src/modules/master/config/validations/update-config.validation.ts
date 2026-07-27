import Joi from 'joi';

import { OptionType, Status } from 'src/common/enums';

export const UpdateConfigValidation = Joi.object({
  name: Joi.string().trim().max(255),
  description: Joi.string().trim().allow(''),
  optionType: Joi.string().valid(...Object.values(OptionType)),
  status: Joi.string().valid(...Object.values(Status)),
}).min(1);
