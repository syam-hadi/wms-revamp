import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '../constants/redis.constants';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const payload = JSON.stringify(value);

    if (ttl) {
      await this.redis.set(key, payload, 'EX', ttl);
      return;
    }

    await this.redis.set(key, payload);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    await this.redis.del(...keys);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  async increment(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async decrement(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return (await this.redis.expire(key, seconds)) === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  async flush(): Promise<void> {
    await this.redis.flushdb();
  }

  async ping(): Promise<string> {
    return this.redis.ping();
  }

  async deletePattern(pattern: string): Promise<void> {
    const stream = this.redis.scanStream({
      match: pattern,
      count: 100,
    });

    await new Promise<void>((resolve, reject) => {
      stream.on('data', (keys: string[]) => {
        if (keys.length === 0) {
          return;
        }

        stream.pause();

        const pipeline = this.redis.pipeline();

        keys.forEach((key) => {
          pipeline.del(key);
        });

        pipeline
          .exec()
          .then(() => {
            stream.resume();
          })
          .catch((error: unknown) => {
            const exception = this.toError(error);

            this.logger.error(
              `Failed deleting Redis pattern: ${pattern}`,
              exception.stack,
            );

            stream.destroy(exception);

            reject(exception);
          });
      });

      stream.on('end', () => {
        resolve();
      });

      stream.on('error', (error: unknown) => {
        reject(this.toError(error));
      });
    });
  }

  async onApplicationShutdown(): Promise<void> {
    this.logger.log('Disconnecting Redis...');

    await this.redis.quit();
  }

  private toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }
}
