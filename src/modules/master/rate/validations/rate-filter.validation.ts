import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation/base-query.validation';

export const RateFilterValidation = BaseQueryValidation.append({
  status: Joi.any().strip(),
  currencyCode: Joi.string().uuid().optional(),
});
