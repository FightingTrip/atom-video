/**
 * @file jest.setup.js
 * @description Jest测试环境设置文件，配置全局测试环境和模拟对象
 * @author Atom Video Team
 * @date 2025-04-06
 */
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