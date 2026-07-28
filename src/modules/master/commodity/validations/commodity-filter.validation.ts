import * as Joi from 'joi';
import { BaseQueryValidation } from 'src/common/validation/base-query.validation';

export const CommodityFilterValidation = BaseQueryValidation.keys({
  isHazardous: Joi.boolean().optional(),
});
