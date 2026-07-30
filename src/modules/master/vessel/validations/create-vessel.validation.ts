import Joi from 'joi';
import { CreateVesselContract } from '../contracts';

export const createVesselValidation = Joi.object<CreateVesselContract>({
  name: Joi.string().trim().max(100).required(),
  imoNumber: Joi.string()
    .regex(/^\d{7}$/)
    .required(),
  callSign: Joi.string().trim().max(10).optional().allow(null, ''),
  grossTonnage: Joi.number().integer().min(0).optional().allow(null),
  teuCapacity: Joi.number().integer().min(0).optional().allow(null),
  loaMeters: Joi.number().positive().optional().allow(null),
});
