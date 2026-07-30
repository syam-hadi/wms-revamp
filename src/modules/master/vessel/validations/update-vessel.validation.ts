import Joi from 'joi';
import { UpdateVesselContract } from '../contracts';

export const updateVesselValidation = Joi.object<UpdateVesselContract>({
  name: Joi.string().trim().max(100).optional(),
  callSign: Joi.string().trim().max(10).optional().allow(null, ''),
  grossTonnage: Joi.number().integer().min(0).optional().allow(null),
  teuCapacity: Joi.number().integer().min(0).optional().allow(null),
  loaMeters: Joi.number().positive().optional().allow(null),
});
