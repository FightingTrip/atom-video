/**
 * @file mockInitializer.ts
 * @description 模拟数据库初始化工具
 */

import mockDb from '../mock/mockDb';

/**
 * 模拟请求延迟
 * @param minDelay 最小延迟时间（毫秒）
 * @param maxDelay 最大延迟时间（毫秒），如果提供，将生成在minDelay和maxDelay之间的随机延迟
 * @returns Promise对象
 */
export const mockDelay = (minDelay = 300, maxDelay?: number): Promise<void> => {
  // 如果提供了最大延迟，则生成随机延迟，否则使用固定延迟
  const delay = maxDelay
    ? Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
    : minDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * 初始化模拟数据库
 */
export function initMockDatabase(): void {
  console.log('[Mock] 初始化模拟数据库...');

  // mockDb 在导入时会自动初始化，无需在此处额外初始化

  // 设置本地存储标记，表示已初始化
  localStorage.setItem('mock_db_initialized', 'true');

  console.log('[Mock] 模拟数据库初始化完成');
}

/**
 * 检查模拟数据库是否已初始化
 */
export function isMockDatabaseInitialized(): boolean {
  return localStorage.getItem('mock_db_initialized') === 'true';
}

/**
 * 重置模拟数据库
 */
export function resetMockDatabase(): void {
  // 清除初始化标记
  localStorage.removeItem('mock_db_initialized');

  // 刷新页面以重新加载模拟数据
  window.location.reload();
}
