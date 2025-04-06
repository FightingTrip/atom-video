import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
/**
 * 格式化视频时长
 * @param seconds 视频时长（秒）
 */
export const formatDuration = (seconds) => {
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
export const formatViews = (num) => {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '亿';
    }
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
};
/**
 * 格式化时间
 * @param date 时间字符串
 */
export const formatTime = (date) => {
    return dayjs(date).fromNow();
};
/**
 * 生成唯一ID
 * @returns string 生成的唯一ID
 */
export const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};
/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
/**
 * 格式化日期
 * @param date 日期字符串
 * @param format 日期格式，默认为 'YYYY-MM-DD'
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
    return dayjs(date).format(format);
};
//# sourceMappingURL=format.js.map