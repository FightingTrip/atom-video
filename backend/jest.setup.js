// 配置测试环境变量
process.env.NODE_ENV = 'test';

// 配置全局超时时间
jest.setTimeout(10000);

// 配置全局模拟
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}; 