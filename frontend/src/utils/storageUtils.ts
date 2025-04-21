/**
 * 存储工具函数
 */

/**
 * 检测浏览器是否支持localStorage
 * @returns {boolean} 是否支持localStorage
 */
export function localStorageSupport(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 安全地获取localStorage项
 * @param {string} key 存储键
 * @param {any} defaultValue 默认值
 * @returns {any} 存储值或默认值
 */
export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * 安全地设置localStorage项
 * @param {string} key 存储键
 * @param {any} value 存储值
 * @returns {boolean} 是否成功
 */
export function safeSetItem(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('localStorage设置失败:', e);
    return false;
  }
}

/**
 * 安全地移除localStorage项
 * @param {string} key 存储键
 * @returns {boolean} 是否成功
 */
export function safeRemoveItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('localStorage移除失败:', e);
    return false;
  }
}

/**
 * 清空所有localStorage
 * @returns {boolean} 是否成功
 */
export function safeClearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (e) {
    console.error('localStorage清空失败:', e);
    return false;
  }
}

/**
 * 获取所有以特定前缀开头的localStorage键
 * @param {string} prefix 前缀
 * @returns {string[]} 键列表
 */
export function getKeysByPrefix(prefix: string): string[] {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (e) {
    return [];
  }
}

/**
 * 移除所有以特定前缀开头的localStorage键
 * @param {string} prefix 前缀
 * @returns {boolean} 是否成功
 */
export function removeItemsByPrefix(prefix: string): boolean {
  try {
    const keys = getKeysByPrefix(prefix);
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 获取localStorage使用情况
 * @returns {{ usage: number, limit: number, percentage: number }} 使用情况
 */
export function getStorageUsage(): { usage: number; limit: number; percentage: number } {
  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }

    // 大多数浏览器localStorage限制为5MB
    const limitSize = 5 * 1024 * 1024;
    const percentage = (totalSize / limitSize) * 100;

    return {
      usage: totalSize,
      limit: limitSize,
      percentage: percentage,
    };
  } catch (e) {
    return {
      usage: 0,
      limit: 5 * 1024 * 1024,
      percentage: 0,
    };
  }
}

/**
 * 检查存储是否即将达到限制
 * @param {number} threshold 阈值百分比（默认80%）
 * @returns {boolean} 是否即将达到限制
 */
export function isStorageNearLimit(threshold: number = 80): boolean {
  const { percentage } = getStorageUsage();
  return percentage > threshold;
}

/**
 * 清理最老的存储项
 * @param {string} prefix 要清理的键前缀
 * @param {number} keepCount 保留的数量
 * @returns {number} 清理的数量
 */
export function cleanupOldestItems(prefix: string, keepCount: number): number {
  try {
    // 获取所有匹配的键
    const keys = getKeysByPrefix(prefix);
    if (keys.length <= keepCount) return 0;

    // 收集键和时间戳
    const keysWithTimestamp: { key: string; timestamp: number }[] = [];

    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const data = JSON.parse(value);
          // 尝试获取时间戳，如果没有则使用当前时间
          const timestamp = data._timestamp || data.timestamp || Date.now();
          keysWithTimestamp.push({ key, timestamp });
        }
      } catch (e) {
        // 如果无法解析，则视为最老的数据
        keysWithTimestamp.push({ key, timestamp: 0 });
      }
    });

    // 按时间戳排序
    keysWithTimestamp.sort((a, b) => a.timestamp - b.timestamp);

    // 删除最老的项
    const removeCount = keysWithTimestamp.length - keepCount;
    for (let i = 0; i < removeCount; i++) {
      localStorage.removeItem(keysWithTimestamp[i].key);
    }

    return removeCount;
  } catch (e) {
    console.error('清理存储失败:', e);
    return 0;
  }
}
