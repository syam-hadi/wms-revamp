import * as Joi from 'joi';

export const UpdateCommodityValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  hsCode: Joi.string().max(12).allow(null, '').optional(),
  category: Joi.string().max(50).optional(),

  isHazardous: Joi.boolean().optional(),
  imdgClass: Joi.string()
    .max(10)
    .when('isHazardous', {
      is: true,
      then: Joi.optional().allow(null, ''),
      otherwise: Joi.forbidden().messages({
        'any.unknown': 'imdgClass is not allowed when isHazardous is false',
      }),
    }),

  requiresReefer: Joi.boolean().optional(),
  minTemperature: Joi.number()
    .precision(2)
    .when('requiresReefer', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null, ''),
    }),
  maxTemperature: Joi.number()
    .precision(2)
    .when('requiresReefer', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null, ''),
    }),

  remarks: Joi.string().max(255).allow(null, '').optional(),
});
