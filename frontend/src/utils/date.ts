/**
 * 日期格式化工具函数
 */

/**
 * 将ISO日期字符串格式化为指定格式
 * @param dateString ISO日期字符串
 * @param format 格式化模板，默认为 'YYYY-MM-DD HH:mm'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  dateString: string | undefined,
  format: string = 'YYYY-MM-DD HH:mm'
): string {
  if (!dateString) return '无日期';

  const date = new Date(dateString);

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效日期';
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化相对时间（如：几分钟前，几小时前）
 * @param dateString ISO日期字符串
 * @returns 相对时间字符串
 */
export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return '未知时间';

  const date = new Date(dateString);

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效日期';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) {
    return `${diffSec} 秒前`;
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} 分钟前`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour} 小时前`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) {
    return `${diffDay} 天前`;
  }

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return `${diffMonth} 个月前`;
  }

  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} 年前`;
}

/**
 * 判断日期是否为今天
 * @param dateString ISO日期字符串
 */
export function isToday(dateString: string | undefined): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 计算两个日期之间的天数
 * @param startDateString 开始日期
 * @param endDateString 结束日期，默认为当前日期
 */
export function daysBetween(startDateString: string, endDateString?: string): number {
  const startDate = new Date(startDateString);
  const endDate = endDateString ? new Date(endDateString) : new Date();

  // 去除时间部分
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  // 计算毫秒差并转换为天数
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
