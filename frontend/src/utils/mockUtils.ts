/**
 * @file mockUtils.ts
 * @description 用于mock模式和离线模式的工具函数
 */

// 判断是否为mock模式
export const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK !== 'false';
};

// 手动开启mock模式
export const enableMockMode = (): void => {
  window.localStorage.setItem('force_mock_mode', 'true');
  console.log('Mock模式已手动开启');
};

// 手动关闭mock模式
export const disableMockMode = (): void => {
  window.localStorage.removeItem('force_mock_mode');
  console.log('Mock模式已手动关闭');
};

// 判断是否为离线模式
export const isOfflineMode = (): boolean => {
  // 首先检查浏览器网络状态
  if (!navigator.onLine) {
    return true;
  }

  // 然后检查localStorage中的标记
  return window.localStorage.getItem('offline_mode') === 'true';
};

// 开启离线模式
export const enableOfflineMode = (): void => {
  window.localStorage.setItem('offline_mode', 'true');
  console.log('离线模式已开启');
};

// 关闭离线模式
export const disableOfflineMode = (): void => {
  window.localStorage.removeItem('offline_mode');
  console.log('离线模式已关闭');
};

// 检查系统是否应该使用mock数据
export const shouldUseMockData = (): boolean => {
  // 如果是mock模式或离线模式，都应该使用mock数据
  return (
    isMockMode() || isOfflineMode() || window.localStorage.getItem('force_mock_mode') === 'true'
  );
};

// 检查是否可以发送API请求
export const canMakeApiRequest = (): boolean => {
  // 如果是离线模式但不是mock模式，不应该发送请求
  if (isOfflineMode() && !shouldUseMockData()) {
    return false;
  }

  return true;
};

// 网络状态变化处理
export const setupNetworkStatusListeners = (): void => {
  // 网络恢复时，清除离线模式
  window.addEventListener('online', () => {
    console.log('网络连接已恢复');
    // 如果不是强制离线模式，则自动清除离线模式
    if (window.localStorage.getItem('force_offline_mode') !== 'true') {
      disableOfflineMode();
    }
  });

  // 网络断开时，设置离线模式
  window.addEventListener('offline', () => {
    console.log('网络连接已断开');
    enableOfflineMode();
  });
};

// 切换mock模式
export const toggleMockMode = (): boolean => {
  const currentStatus = window.localStorage.getItem('force_mock_mode') === 'true';

  if (currentStatus) {
    disableMockMode();
    return false;
  } else {
    enableMockMode();
    return true;
  }
};

// 切换离线模式
export const toggleOfflineMode = (): boolean => {
  const currentStatus = window.localStorage.getItem('offline_mode') === 'true';

  if (currentStatus) {
    disableOfflineMode();
    window.localStorage.removeItem('force_offline_mode');
    return false;
  } else {
    enableOfflineMode();
    window.localStorage.setItem('force_offline_mode', 'true');
    return true;
  }
};
