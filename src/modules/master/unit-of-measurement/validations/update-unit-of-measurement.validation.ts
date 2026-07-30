import Joi from 'joi';

export const UpdateUnitOfMeasurementValidation = Joi.object({
  name: Joi.string().optional().trim().max(150),
  unit: Joi.string().optional().trim().max(100),
  description: Joi.string().optional().trim().max(100).allow(null, ''),
});
