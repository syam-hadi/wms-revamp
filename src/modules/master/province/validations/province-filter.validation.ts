import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation';

export const ProvinceFilterValidation = BaseQueryValidation.append({
  status: Joi.any().strip(),
  countryId: Joi.string().uuid().optional(),
  sortBy: Joi.string().valid('code', 'name', 'createdAt').default('code'),
});
