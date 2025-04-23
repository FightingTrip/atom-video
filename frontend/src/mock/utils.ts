/**
 * @file utils.ts
 * @description Mock数据相关的工具函数
 */

/**
 * 生成带前缀的唯一ID
 * @param prefix ID前缀
 * @returns 唯一ID字符串
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * 检查日期是否为今天
 * @param dateString 日期字符串
 * @returns 是否为今天
 */
export const isToday = (dateString: string | undefined): boolean => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * 随机选择数组中的一个元素
 * @param array 数组
 * @returns 随机选择的元素
 */
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 随机生成整数范围
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
