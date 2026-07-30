import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET!,
  accessTokenExpires: process.env.JWT_ACCESS_TOKEN_EXPIRES ?? '30m',
  refreshTokenExpires: process.env.JWT_REFRESH_TOKEN_EXPIRES ?? '7d',
}));
