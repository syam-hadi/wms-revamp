import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'WMS Revamp API',
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.APP_PORT ?? 4000),
  version: process.env.APP_VERSION ?? '1.0.0',
  apiPrefix: process.env.API_PREFIX ?? 'api',
  apiVersion: process.env.API_VERSION ?? 'v1',
}));
