import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { REDIS_CLIENT } from './constants/redis.constants';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Redis> => {
    const options: RedisOptions = {
      host: configService.getOrThrow<string>('redis.host'),
      port: configService.getOrThrow<number>('redis.port'),
      password: configService.get<string>('redis.password') || undefined,
      db: configService.getOrThrow<number>('redis.db'),
      keyPrefix: configService.getOrThrow<string>('redis.keyPrefix'),

      lazyConnect: true,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      keepAlive: 30000,

      retryStrategy(times: number): number | null {
        return Math.min(times * 500, 5000);
      },
    };

    const redis = new Redis(options);

    await redis.connect();

    return redis;
  },
};
