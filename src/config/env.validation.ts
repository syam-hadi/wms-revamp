import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'staging')
    .default('development'),
  APP_NAME: Joi.string().default('WMS Revamp API'),
  APP_PORT: Joi.number().default(4000),
  APP_VERSION: Joi.string().default('1.0.0'),

  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().default('v1'),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TOKEN_EXPIRES: Joi.string().default('30m'),
  JWT_REFRESH_TOKEN_EXPIRES: Joi.string().default('7d'),

  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_DB: Joi.number().integer().min(0).default(0),
  REDIS_KEY_PREFIX: Joi.string().default('wms:'),

  RABBITMQ_URL: Joi.string().required(),

  SMTP_HOST: Joi.string().hostname().required(),
  SMTP_PORT: Joi.number().port().default(1025),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASSWORD: Joi.string().allow('').optional(),
  SMTP_FROM: Joi.string().required(),

  MINIO_ENDPOINT: Joi.string().hostname().required(),
  MINIO_PORT: Joi.number().port().default(9000),
  MINIO_USE_SSL: Joi.boolean().default(false),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET: Joi.string().required(),

  LOG_LEVEL: Joi.string().default('debug'),

  CRON_TIMEZONE: Joi.string().default('Asia/Jakarta'),
});
