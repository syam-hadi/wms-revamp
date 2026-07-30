import Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation/base-query.validation';

export const CommodityFilterValidation = BaseQueryValidation.append({
  status: Joi.any().strip(),
  isHazardous: Joi.boolean().optional(),
});
