import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation';

export const CityFilterValidation = BaseQueryValidation.append({
  status: Joi.any().strip(),
  provinceId: Joi.string().uuid().optional(),
  sortBy: Joi.string().valid('code', 'name', 'createdAt').default('code'),
});
