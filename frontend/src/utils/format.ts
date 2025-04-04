/**
 * 格式化视频时长
 * @param seconds 视频时长（秒）
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 格式化观看次数
 * @param views 观看次数
 */
export const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

/**
 * 格式化时间
 * @param date 时间字符串
 */
export const formatTime = (date: string): string => {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return '刚刚';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  const years = Math.floor(months / 12);
  return `${years}年前`;
};

/**
 * 生成唯一ID
 * @returns string 生成的唯一ID
 */
export const generateId = (): string => {
  return 'id_' + Math.random().toString(36).substr(2, 9);
};
