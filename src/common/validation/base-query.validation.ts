import Joi from 'joi';
import { SortOrder, Status } from '../enums';

export const BaseQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().allow(''),
  sortBy: Joi.string().trim().default('createdAt'),
  sortOrder: Joi.string()
    .valid(...Object.values(SortOrder))
    .default(SortOrder.ASC),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
});
