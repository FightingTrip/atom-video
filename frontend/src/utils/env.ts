// 环境变量类型定义
interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_USE_MOCK: string;
  VITE_APP_TITLE: string;
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_GITHUB_CLIENT_ID: string;
}

// 环境配置
export const env = {
  // API 基础 URL
  apiUrl: import.meta.env.VITE_API_URL,

  // 是否使用模拟数据
  useMock: import.meta.env.VITE_USE_MOCK === 'true',

  // 应用标题
  appTitle: import.meta.env.VITE_APP_TITLE,

  // OAuth 配置
  oauth: {
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
  },

  // 当前环境
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};
