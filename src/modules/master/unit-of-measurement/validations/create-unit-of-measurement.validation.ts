import Joi from 'joi';

export const CreateUnitOfMeasurementValidation = Joi.object({
  code: Joi.string().required().uppercase().trim().max(20),
  name: Joi.string().required().trim().max(150),
  unit: Joi.string().required().trim().max(100),
  description: Joi.string().optional().trim().max(100).allow(null, ''),
});
