import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation';

export const CurrencyFilterValidation = BaseQueryValidation.append({
  status: Joi.any().strip(),
  sortBy: Joi.string().valid('code', 'name', 'createdAt').default('code'),
});
