/**
 * 通用辅助函数模块
 *
 * 提供各种通用的实用工具函数
 * @module common/utils/helpers
 */

/**
 * 从对象中移除值为null或undefined的属性
 * @param obj 要处理的对象
 * @returns 处理后的对象（不包含null或undefined值）
 */
export function removeNullUndefined<T>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  Object.entries(obj as Record<string, any>).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      (result as Record<string, any>)[key] = value;
    }
  });

  return result;
}

/**
 * 检查字符串是否是有效的UUID格式
 * @param str 要检查的字符串
 * @returns 是否为有效UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charsLength = chars.length;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
}

/**
 * 延迟执行
 * @param ms 毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化日期时间
 * @param date 日期对象或字符串
 * @param format 格式化字符串
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(
  date: Date | string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const pad = (num: number): string => num.toString().padStart(2, '0');

  const replacements: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match]);
}

/**
 * 截断字符串并添加省略号
 * @param str 字符串
 * @param maxLength 最大长度
 * @returns 截断后的字符串
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength) + '...';
}

/**
 * 解析JSON字符串，失败则返回默认值
 * @param jsonString JSON字符串
 * @param defaultValue 默认值
 * @returns 解析后的对象或默认值
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * 检查字符串是否为有效的电子邮件地址
 * @param email 电子邮件地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 检查字符串是否为有效的URL
 * @param url URL
 * @returns 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result: any = { ...target };

  Object.entries(source as Record<string, any>).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      result[key] !== null &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  });

  return result as T;
}
