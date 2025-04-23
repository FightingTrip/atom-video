/**
 * @file format.ts
 * @description 提供常用的格式化函数
 * @author Atom Video Team
 * @date 2025-04-10
 */

import dayjs from 'dayjs';

/**
 * 格式化日期
 * @param date 日期字符串或日期对象
 * @param format 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * 格式化数字（添加千位分隔符或转换为万/亿单位）
 * @param num 数字
 * @param options 格式化选项
 * @returns 格式化后的数字字符串
 */
export function formatNumber(
  num: number | undefined,
  options?: {
    useGrouping?: boolean; // 是否使用千位分隔符
    useUnit?: boolean; // 是否使用万/亿单位
    precision?: number; // 小数位数
    defaultValue?: string; // 默认值（当num为空时返回）
  }
): string {
  if (num === undefined || num === null) {
    return options?.defaultValue || '0';
  }

  const { useGrouping = true, useUnit = true, precision = 1, defaultValue = '0' } = options || {};

  // 当数值为0时，直接返回默认值
  if (num === 0) return defaultValue;

  // 使用单位（万、亿）
  if (useUnit) {
    if (num >= 100000000) {
      // 亿
      return (num / 100000000).toFixed(precision) + '亿';
    } else if (num >= 10000) {
      // 万
      return (num / 10000).toFixed(precision) + '万';
    }
  }

  // 使用千位分隔符
  if (useGrouping) {
    return num.toLocaleString('zh-CN');
  }

  return num.toString();
}

/**
 * 格式化时长（秒转为时:分:秒）
 * @param seconds 总秒数
 * @param showHours 是否始终显示小时位
 * @returns 格式化后的时长字符串
 */
export function formatDuration(seconds: number | undefined, showHours: boolean = false): string {
  if (seconds === undefined || seconds === null) return '--:--';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0 || showHours) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param precision 小数位数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number | undefined, precision: number = 2): string {
  if (bytes === undefined || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + ' ' + sizes[i];
}

/**
 * 截断文本（超出长度显示省略号）
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 格式化手机号码（中间4位隐藏）
 * @param phoneNumber 手机号码
 * @returns 格式化后的手机号码
 */
export function formatPhoneNumber(phoneNumber: string | undefined): string {
  if (!phoneNumber) return '';
  if (phoneNumber.length !== 11) return phoneNumber;
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 格式化邮箱（部分隐藏）
 * @param email 邮箱地址
 * @returns 格式化后的邮箱
 */
export function formatEmail(email: string | undefined): string {
  if (!email || !email.includes('@')) return email || '';

  const [username, domain] = email.split('@');
  let maskedUsername = username;

  if (username.length > 2) {
    maskedUsername =
      username.substring(0, 1) +
      '*'.repeat(username.length - 2) +
      username.substring(username.length - 1);
  }

  return `${maskedUsername}@${domain}`;
}

/**
 * 生成唯一ID
 * @returns 生成的唯一ID字符串
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * 格式化金额
 * @param amount 金额数值
 * @param currency 货币符号，默认为 ¥
 * @param decimals 小数位数，默认为 2
 * @returns 格式化后的金额字符串
 */
export function formatCurrency(
  amount: number | undefined,
  currency: string = '¥',
  decimals: number = 2
): string {
  if (amount === undefined) return `${currency}0.00`;

  const formattedAmount = amount.toFixed(decimals);
  const parts = formattedAmount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${currency}${parts.join('.')}`;
}

/**
 * 格式化百分比
 * @param value 需要格式化的值（0-1之间）
 * @param decimals 小数位数，默认为 2
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(value: number | undefined, decimals: number = 2): string {
  if (value === undefined) return '0%';

  return (value * 100).toFixed(decimals) + '%';
}
