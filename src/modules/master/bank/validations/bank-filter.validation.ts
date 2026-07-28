import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation';

export const BankFilterValidation = BaseQueryValidation.append({
  status: Joi.any().strip(),
  sortBy: Joi.string()
    .valid('code', 'shortName', 'name', 'createdAt')
    .default('code'),
});
