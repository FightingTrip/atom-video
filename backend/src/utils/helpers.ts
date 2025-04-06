import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * 通用辅助工具函数
 */

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function generateRandomString(length = 32): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

/**
 * 生成UUID
 * @returns UUID字符串
 */
export function generateUuid(): string {
  return uuidv4();
}

/**
 * 生成slug（URL友好的字符串）
 * @param str 输入字符串
 * @returns 处理后的slug
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 移除对象中的null和undefined值
 * @param obj 输入对象
 * @returns 清理后的对象
 */
export function removeNullUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

/**
 * 检查值是否为对象
 * @param item 要检查的值
 * @returns 是否为对象
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 转换数组为记录对象
 * @param array 输入数组
 * @param getKey 获取键的函数
 * @returns 转换后的记录对象
 */
export function arrayToRecord<T, K extends string | number | symbol>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T> {
  return array.reduce(
    (acc, item) => {
      const key = getKey(item);
      acc[key] = item;
      return acc;
    },
    {} as Record<K, T>
  );
}

/**
 * 解析字符串为JSON，失败时返回默认值
 * @param str 要解析的字符串
 * @param defaultValue 解析失败时的默认值
 * @returns 解析结果
 */
export function safeJsonParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * 解析查询参数
 * @param query 查询对象
 * @param key 参数键
 * @param converter 转换函数
 * @param defaultValue 默认值
 * @returns 转换后的值
 */
export function parseQueryParam<T, R>(
  query: Record<string, any>,
  key: string,
  converter: (value: any) => R,
  defaultValue: R
): R {
  if (!(key in query) || query[key] === undefined || query[key] === null) {
    return defaultValue;
  }

  try {
    return converter(query[key]);
  } catch (error) {
    return defaultValue;
  }
}
