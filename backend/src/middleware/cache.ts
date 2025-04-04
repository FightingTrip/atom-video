import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/redisService';
import logger from '../utils/logger';

// 缓存中间件选项
interface CacheMiddlewareOptions {
  ttl?: number;
  prefix?: string;
  excludePaths?: string[];
  includeMethods?: string[];
}

// 默认配置
const defaultOptions: CacheMiddlewareOptions = {
  ttl: 300, // 默认 5 分钟
  prefix: 'api',
  excludePaths: ['/api/auth', '/api/admin'],
  includeMethods: ['GET'],
};

// 生成缓存键
function generateCacheKey(req: Request): string {
  const { method, originalUrl, query, body } = req;
  return `${method}:${originalUrl}:${JSON.stringify(query)}:${JSON.stringify(body)}`;
}

// 缓存中间件
export function cacheMiddleware(options: CacheMiddlewareOptions = {}) {
  const config = { ...defaultOptions, ...options };

  return async (req: Request, res: Response, next: NextFunction) => {
    // 检查是否应该缓存
    if (
      !config.includeMethods?.includes(req.method) ||
      config.excludePaths?.some(path => req.path.startsWith(path))
    ) {
      return next();
    }

    try {
      // 生成缓存键
      const cacheKey = `${config.prefix}:${generateCacheKey(req)}`;

      // 尝试从缓存获取响应
      const cachedResponse = await redisService.get(cacheKey);
      if (cachedResponse) {
        logger.debug(`缓存命中: ${cacheKey}`);
        return res.json(cachedResponse);
      }

      // 缓存未命中，继续处理请求
      const originalJson = res.json;
      res.json = function (body: any) {
        // 存储响应到缓存
        redisService
          .set(cacheKey, body, config.ttl)
          .catch(error => logger.error('缓存响应失败:', error));

        // 调用原始的 json 方法
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      logger.error('缓存中间件错误:', error);
      next();
    }
  };
}

// 清除缓存中间件
export function clearCacheMiddleware(options: CacheMiddlewareOptions = {}) {
  const config = { ...defaultOptions, ...options };

  return async (req: Request, res: Response, next: NextFunction) => {
    // 检查是否应该清除缓存
    if (
      !['POST', 'PUT', 'DELETE'].includes(req.method) ||
      config.excludePaths?.some(path => req.path.startsWith(path))
    ) {
      return next();
    }

    try {
      // 清除相关缓存
      const pattern = `${config.prefix}:*`;
      const keys = await redisService.redis.keys(pattern);

      if (keys.length > 0) {
        await redisService.redis.del(...keys);
        logger.debug(`清除缓存: ${keys.length} 个键`);
      }

      next();
    } catch (error) {
      logger.error('清除缓存中间件错误:', error);
      next();
    }
  };
}
