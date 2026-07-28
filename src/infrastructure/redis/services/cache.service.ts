import { Injectable, Logger } from '@nestjs/common';

import { RedisService } from './redis.service';

enum CacheStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private cacheStatus = CacheStatus.UP;
  private probeTimer: NodeJS.Timeout | null = null;
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(private readonly redisService: RedisService) {}

  async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
    refresh = false,
  ): Promise<T> {
    if (!refresh && this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise: Promise<T> = Promise.resolve().then(async () => {
      try {
        if (!refresh) {
          const cached = await this.safeRedis(
            () => this.redisService.get<T>(key),
            null,
          );

          if (cached !== null) {
            return cached;
          }
        }

        const value = await callback();

        if (this.pendingRequests.get(key) === promise) {
          await this.safeRedisVoid(() =>
            this.redisService.set(key, value, ttl),
          );
        }

        return value;
      } finally {
        if (this.pendingRequests.get(key) === promise) {
          this.pendingRequests.delete(key);
        }
      }
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  async rememberForever<T>(
    key: string,
    callback: () => Promise<T>,
    refresh = false,
  ): Promise<T> {
    if (!refresh && this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise: Promise<T> = Promise.resolve().then(async () => {
      try {
        if (!refresh) {
          const cached = await this.safeRedis(
            () => this.redisService.get<T>(key),
            null,
          );

          if (cached !== null) {
            return cached;
          }
        }

        const value = await callback();

        if (this.pendingRequests.get(key) === promise) {
          await this.safeRedisVoid(() => this.redisService.set(key, value));
        }

        return value;
      } finally {
        if (this.pendingRequests.get(key) === promise) {
          this.pendingRequests.delete(key);
        }
      }
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  async refresh<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    return this.remember(key, ttl, callback, true);
  }

  async warmUp<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<void> {
    await this.refresh(key, ttl, callback);
  }

  async invalidate(key: string): Promise<void> {
    this.pendingRequests.delete(key);
    await this.safeRedisVoid(() => this.redisService.delete(key));
  }

  async invalidateMany(keys: readonly string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    keys.forEach((key) => this.pendingRequests.delete(key));
    await this.safeRedisVoid(() => this.redisService.deleteMany([...keys]));
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');

    for (const key of this.pendingRequests.keys()) {
      if (regex.test(key)) {
        this.pendingRequests.delete(key);
      }
    }

    await this.safeRedisVoid(() => this.redisService.deletePattern(pattern));
  }

  async exists(key: string): Promise<boolean> {
    return this.safeRedis(() => this.redisService.exists(key), false);
  }

  private async safeRedis<T>(
    action: () => Promise<T>,
    fallback: T,
  ): Promise<T> {
    if (this.cacheStatus === CacheStatus.DOWN) {
      return fallback;
    }

    try {
      const result = await action();
      this.markRedisUp();
      return result;
    } catch (error) {
      this.markRedisDown(this.toError(error));
      return fallback;
    }
  }

  private async safeRedisVoid(action: () => Promise<void>): Promise<void> {
    if (this.cacheStatus === CacheStatus.DOWN) {
      return;
    }

    try {
      await action();
      this.markRedisUp();
    } catch (error) {
      this.markRedisDown(this.toError(error));
    }
  }

  private markRedisDown(error: Error): void {
    if (this.cacheStatus === CacheStatus.DOWN) {
      return;
    }

    this.cacheStatus = CacheStatus.DOWN;
    this.logger.warn(
      `Redis unavailable. Falling back to database. ${error.message}`,
    );

    if (!this.probeTimer) {
      this.probeTimer = setInterval(() => {
        this.redisService
          .ping()
          .then(() => {
            this.markRedisUp();
          })
          .catch(() => {
            // Stay DOWN, ignore ping error
          });
      }, 5000);
      this.probeTimer.unref();
    }
  }

  private markRedisUp(): void {
    if (this.cacheStatus === CacheStatus.UP) {
      return;
    }

    this.cacheStatus = CacheStatus.UP;
    this.logger.log('Redis connection restored.');

    if (this.probeTimer) {
      clearInterval(this.probeTimer);
      this.probeTimer = null;
    }
  }

  private toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }
}
