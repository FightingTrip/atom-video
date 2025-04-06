import 'dayjs/locale/zh-cn';
/**
 * 格式化视频时长
 * @param seconds 视频时长（秒）
 */
export declare const formatDuration: (seconds: number) => string;
/**
 * 格式化观看次数
 * @param views 观看次数
 */
export declare const formatViews: (num: number) => string;
/**
 * 格式化时间
 * @param date 时间字符串
 */
export declare const formatTime: (date: string) => string;
/**
 * 生成唯一ID
 * @returns string 生成的唯一ID
 */
export declare const generateId: () => string;
export declare const formatNumber: (num: number) => string;
/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 */
export declare const formatFileSize: (bytes: number) => string;
/**
 * 格式化日期
 * @param date 日期字符串
 * @param format 日期格式，默认为 'YYYY-MM-DD'
 */
export declare const formatDate: (date: string, format?: string) => string;
