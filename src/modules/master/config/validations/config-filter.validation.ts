import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation';

export const ConfigFilterValidation = BaseQueryValidation.append({
  configGroup: Joi.string().trim().allow(''),
  sortBy: Joi.string()
    .valid('code', 'name', 'configGroup', 'status', 'createdAt')
    .default('code'),
});
