import { config } from '@vue/test-utils';

// 配置 Vue Test Utils
config.global.mocks = {
  $t: (key) => key,
  $i18n: {
    locale: 'zh-CN',
  },
};

// 配置全局测试环境
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 