import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { REDIS_CLIENT } from './constants/redis.constants';
import { RedisService } from './services/redis.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Redis({
          host: config.getOrThrow<string>('redis.host'),
          port: config.getOrThrow<number>('redis.port'),
          password: config.get<string>('redis.password'),
          db: config.getOrThrow<number>('redis.db'),
          keyPrefix: config.getOrThrow<string>('redis.keyPrefix'),
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
        });
      },
    },
    RedisService,
    CacheService,
  ],
  exports: [RedisService, CacheService],
})
export class RedisModule {}
