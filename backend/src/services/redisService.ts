import Redis from 'ioredis';
import logger from '../utils/logger';
import { cacheMonitorService } from './cacheMonitorService';

class RedisService {
  private static instance: RedisService;
  public redis: Redis;

  private constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: times => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('error', error => {
      logger.error('Redis 连接错误:', error);
      cacheMonitorService.recordError();
    });

    this.redis.on('connect', () => {
      logger.info('Redis 连接成功');
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  // 设置缓存
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      logger.error('Redis 设置缓存失败:', error);
      cacheMonitorService.recordError();
      throw error;
    }
  }

  // 获取缓存
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (value !== null) {
        cacheMonitorService.recordHit();
        return JSON.parse(value);
      } else {
        cacheMonitorService.recordMiss();
        return null;
      }
    } catch (error) {
      logger.error('Redis 获取缓存失败:', error);
      cacheMonitorService.recordError();
      return null;
    }
  }

  // 删除缓存
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Redis 删除缓存失败:', error);
      cacheMonitorService.recordError();
      throw error;
    }
  }

  // 检查缓存是否存在
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis 检查缓存失败:', error);
      cacheMonitorService.recordError();
      return false;
    }
  }

  // 设置过期时间
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.redis.expire(key, ttl);
    } catch (error) {
      logger.error('Redis 设置过期时间失败:', error);
      cacheMonitorService.recordError();
      throw error;
    }
  }

  // 获取剩余过期时间
  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      logger.error('Redis 获取过期时间失败:', error);
      cacheMonitorService.recordError();
      return -2;
    }
  }

  // 清除所有缓存
  async flushAll(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      logger.error('Redis 清除缓存失败:', error);
      cacheMonitorService.recordError();
      throw error;
    }
  }

  // 关闭连接
  async quit(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      logger.error('Redis 关闭连接失败:', error);
      cacheMonitorService.recordError();
      throw error;
    }
  }
}

export const redisService = RedisService.getInstance();
