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
