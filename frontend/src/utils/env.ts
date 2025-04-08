/**
 * @file env.ts
 * @description 环境变量工具模块，封装项目环境配置访问
 * @author Atom Video Team
 * @date 2025-04-06
 */
// 环境变量类型定义
interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_WS_URL: string;
  VITE_USE_MOCK: string;
  VITE_APP_TITLE: string;
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_GITHUB_CLIENT_ID: string;
}

// 环境配置
const env = {
  // API 基础 URL
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // WebSocket URL
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws',

  // 是否使用模拟数据
  useMock: import.meta.env.VITE_USE_MOCK === 'true',

  // 应用标题
  appTitle: import.meta.env.VITE_APP_TITLE || 'Atom Video',

  // OAuth 配置
  oauth: {
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
  },

  // 当前环境
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// 调试信息
if (env.isDev) {
  console.log('Environment:', {
    apiUrl: env.apiUrl,
    wsUrl: env.wsUrl,
    useMock: env.useMock,
    isDev: env.isDev,
    isProd: env.isProd,
    mode: env.mode,
  });
}

export { env };
