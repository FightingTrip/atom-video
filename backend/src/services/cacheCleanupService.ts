import { redisService } from './redisService';
import logger from '../utils/logger';

class CacheCleanupService {
  private static instance: CacheCleanupService;

  private constructor() {}

  public static getInstance(): CacheCleanupService {
    if (!CacheCleanupService.instance) {
      CacheCleanupService.instance = new CacheCleanupService();
    }
    return CacheCleanupService.instance;
  }

  // 清理过期缓存
  public async cleanupExpired(): Promise<void> {
    try {
      const keys = await redisService.redis.keys('*');
      let deletedCount = 0;

      for (const key of keys) {
        const ttl = await redisService.redis.ttl(key);
        if (ttl === -2) {
          // 键已过期
          await redisService.redis.del(key);
          deletedCount++;
        }
      }

      logger.info(`清理过期缓存完成，删除了 ${deletedCount} 个键`);
    } catch (error) {
      logger.error('清理过期缓存失败:', error);
      throw error;
    }
  }

  // 清理指定前缀的缓存
  public async cleanupByPrefix(prefix: string): Promise<void> {
    try {
      const pattern = `${prefix}:*`;
      const keys = await redisService.redis.keys(pattern);

      if (keys.length > 0) {
        await redisService.redis.del(...keys);
        logger.info(`清理前缀为 ${prefix} 的缓存完成，删除了 ${keys.length} 个键`);
      }
    } catch (error) {
      logger.error('清理指定前缀的缓存失败:', error);
      throw error;
    }
  }

  // 清理所有缓存
  public async cleanupAll(): Promise<void> {
    try {
      await redisService.redis.flushall();
      logger.info('清理所有缓存完成');
    } catch (error) {
      logger.error('清理所有缓存失败:', error);
      throw error;
    }
  }

  // 启动定期清理任务
  public startCleanupTask(interval = 3600000): void {
    // 默认每小时清理一次
    setInterval(async () => {
      try {
        await this.cleanupExpired();
      } catch (error) {
        logger.error('执行定期清理任务失败:', error);
      }
    }, interval);
  }
}

export const cacheCleanupService = CacheCleanupService.getInstance();
