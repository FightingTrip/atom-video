import { redisService } from '../services/redisService';

// 缓存装饰器选项
interface CacheOptions {
  key?: string;
  ttl?: number;
  prefix?: string;
}

// 缓存装饰器
export function Cache(options: CacheOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // 生成缓存键
      const key =
        options.key || `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      const cacheKey = options.prefix ? `${options.prefix}:${key}` : key;

      try {
        // 尝试从缓存获取数据
        const cachedValue = await redisService.get(cacheKey);
        if (cachedValue !== null) {
          return cachedValue;
        }

        // 缓存未命中，执行原始方法
        const result = await originalMethod.apply(this, args);

        // 将结果存入缓存
        if (result !== null && result !== undefined) {
          await redisService.set(cacheKey, result, options.ttl);
        }

        return result;
      } catch (error) {
        // 缓存出错时，直接执行原始方法
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}

// 清除缓存装饰器
export function ClearCache(options: CacheOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // 执行原始方法
      const result = await originalMethod.apply(this, args);

      try {
        // 生成缓存键
        const key =
          options.key || `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
        const cacheKey = options.prefix ? `${options.prefix}:${key}` : key;

        // 删除缓存
        await redisService.del(cacheKey);
      } catch (error) {
        // 缓存删除失败不影响主流程
        console.error('清除缓存失败:', error);
      }

      return result;
    };

    return descriptor;
  };
}
