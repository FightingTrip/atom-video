import { redisService } from './redisService';
import logger from '../utils/logger';

class CacheMonitorService {
  private static instance: CacheMonitorService;
  private stats: {
    hits: number;
    misses: number;
    errors: number;
    memoryUsage: number;
  };

  private constructor() {
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      memoryUsage: 0,
    };
  }

  public static getInstance(): CacheMonitorService {
    if (!CacheMonitorService.instance) {
      CacheMonitorService.instance = new CacheMonitorService();
    }
    return CacheMonitorService.instance;
  }

  // 记录缓存命中
  public recordHit(): void {
    this.stats.hits++;
  }

  // 记录缓存未命中
  public recordMiss(): void {
    this.stats.misses++;
  }

  // 记录缓存错误
  public recordError(): void {
    this.stats.errors++;
  }

  // 获取缓存命中率
  public getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? this.stats.hits / total : 0;
  }

  // 获取缓存统计信息
  public async getStats(): Promise<{
    hits: number;
    misses: number;
    errors: number;
    hitRate: number;
    memoryUsage: number;
    keys: number;
  }> {
    try {
      const info = await redisService.redis.info();
      const memoryMatch = info.match(/used_memory:(\d+)/);
      const memoryUsage = memoryMatch ? parseInt(memoryMatch[1]) : 0;

      const keys = await redisService.redis.dbsize();

      return {
        ...this.stats,
        hitRate: this.getHitRate(),
        memoryUsage,
        keys,
      };
    } catch (error) {
      logger.error('获取缓存统计信息失败:', error);
      throw error;
    }
  }

  // 重置统计信息
  public resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      memoryUsage: 0,
    };
  }

  // 定期记录统计信息
  public startMonitoring(interval = 60000): void {
    setInterval(async () => {
      try {
        const stats = await this.getStats();
        logger.info('缓存统计信息:', {
          hits: stats.hits,
          misses: stats.misses,
          hitRate: stats.hitRate.toFixed(2),
          memoryUsage: `${(stats.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
          keys: stats.keys,
        });
      } catch (error) {
        logger.error('记录缓存统计信息失败:', error);
      }
    }, interval);
  }
}

export const cacheMonitorService = CacheMonitorService.getInstance();
