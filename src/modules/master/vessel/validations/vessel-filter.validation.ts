import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation';

export const vesselFilterValidation = BaseQueryValidation.append({
  search: Joi.string().optional().allow(null, ''),
  sortBy: Joi.string().valid('name', 'imoNumber', 'createdAt').default('name'),
});
