/**
 * @file timeFormatters.ts
 * @description 时间格式化工具函数
 */

/**
 * 格式化视频时长（秒数转为时:分:秒格式）
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`;
  }

  return `${padZero(minutes)}:${padZero(secs)}`;
}

/**
 * 数字前填充零
 * @param num 数字
 * @returns 填充零后的字符串
 */
function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * 格式化时间为相对时间（如：3天前、2小时前等）
 * @param dateString 日期字符串
 * @returns 相对时间字符串
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '未知时间';
  }

  // 不同时间单位的秒数
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  // 根据时间差返回相应的相对时间
  if (seconds < 5) {
    return '刚刚';
  } else if (seconds < minute) {
    return `${seconds}秒前`;
  } else if (seconds < hour) {
    const minutes = Math.floor(seconds / minute);
    return `${minutes}分钟前`;
  } else if (seconds < day) {
    const hours = Math.floor(seconds / hour);
    return `${hours}小时前`;
  } else if (seconds < week) {
    const days = Math.floor(seconds / day);
    return `${days}天前`;
  } else if (seconds < month) {
    const weeks = Math.floor(seconds / week);
    return `${weeks}周前`;
  } else if (seconds < year) {
    const months = Math.floor(seconds / month);
    return `${months}个月前`;
  } else {
    const years = Math.floor(seconds / year);
    return `${years}年前`;
  }
}

/**
 * 格式化数字（如：视频播放量）为更易读的形式
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  if (isNaN(num)) {
    return '0';
  }

  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }

  return num.toString();
}

/**
 * 计算应该显示的进度条宽度
 * @param currentTime 当前时间（秒）
 * @param duration 总时长（秒）
 * @returns 百分比宽度
 */
export function calculateProgressWidth(currentTime: number, duration: number): number {
  if (isNaN(currentTime) || isNaN(duration) || duration <= 0) {
    return 0;
  }
  return (currentTime / duration) * 100;
}

/**
 * 获取视频进度描述
 * @param currentTime 当前时间（秒）
 * @param duration 总时长（秒）
 * @returns 进度描述文本
 */
export function getProgressText(currentTime: number, duration: number): string {
  return `${formatDuration(currentTime)} / ${formatDuration(duration)}`;
}

/**
 * 检查视频是否已完成观看（观看进度超过90%）
 * @param currentTime 当前时间（秒）
 * @param duration 总时长（秒）
 * @returns 是否已完成观看
 */
export function isVideoWatched(currentTime: number, duration: number): boolean {
  if (isNaN(currentTime) || isNaN(duration) || duration <= 0) {
    return false;
  }

  return currentTime / duration > 0.9;
}

/**
 * 获取跳过片头的时间（开头60秒内的10%）
 * @param duration 总时长（秒）
 * @returns 跳过片头的时间点（秒）
 */
export function getSkipIntroTime(duration: number): number {
  if (isNaN(duration) || duration <= 0) {
    return 0;
  }

  // 计算片头长度（默认为总时长的10%，最长不超过60秒）
  const introLength = Math.min(duration * 0.1, 60);
  return introLength;
}

/**
 * 获取跳过片尾的时间（结尾之前的5%）
 * @param duration 总时长（秒）
 * @returns 跳过片尾的时间点（秒）
 */
export function getSkipOutroTime(duration: number): number {
  if (isNaN(duration) || duration <= 0) {
    return 0;
  }

  // 计算片尾时间点（默认为总时长的95%）
  return duration * 0.95;
}
