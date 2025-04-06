/**
 * 日期和时间工具函数
 */

/**
 * 格式化日期为ISO字符串
 * @param date 日期对象或字符串
 * @returns ISO格式的日期字符串
 */
export function formatISODate(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString();
}

/**
 * 计算过去时间（如"3分钟前"）
 * @param date 日期对象或字符串
 * @returns 相对时间字符串
 */
export function timeAgo(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // 处理未来时间
  if (seconds < 0) {
    return '刚刚';
  }

  // 时间间隔定义
  const intervals = {
    年: 31536000,
    月: 2592000,
    周: 604800,
    天: 86400,
    小时: 3600,
    分钟: 60,
    秒: 1,
  };

  // 查找最合适的时间单位
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? '' : ''}前`;
    }
  }

  return '刚刚';
}

/**
 * 格式化视频时长（将秒转换为 HH:MM:SS 格式）
 * @param durationInSeconds 时长（秒）
 * @returns 格式化的时长字符串
 */
export function formatVideoDuration(durationInSeconds: number): string {
  if (isNaN(durationInSeconds) || durationInSeconds < 0) {
    return '00:00';
  }

  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  // 根据时长决定是否显示小时
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 获取当前ISO日期时间字符串
 * @returns 当前ISO格式的日期时间字符串
 */
export function getCurrentISODateTime(): string {
  return new Date().toISOString();
}

/**
 * 计算两个日期之间的天数差
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数差
 */
export function daysBetween(
  startDate: Date | string | number,
  endDate: Date | string | number = new Date()
): number {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  // 清除时分秒，只保留日期
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  // 计算毫秒差，并转换为天数
  const differenceMs = endDay.getTime() - startDay.getTime();
  return Math.round(differenceMs / (1000 * 60 * 60 * 24));
}

/**
 * 增加或减少日期的天/月/年
 * @param date 起始日期
 * @param amount 增减数量
 * @param unit 单位 ('days' | 'months' | 'years')
 * @returns 新的日期对象
 */
export function addToDate(
  date: Date | string | number,
  amount: number,
  unit: 'days' | 'months' | 'years'
): Date {
  const result = date instanceof Date ? new Date(date) : new Date(date);

  switch (unit) {
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
  }

  return result;
}
