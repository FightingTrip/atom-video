// 环境配置
const env = {
    // API 基础 URL
    apiUrl: import.meta.env.VITE_API_BASE_URL,
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
// 调试信息
console.log('Environment:', {
    apiUrl: env.apiUrl,
    useMock: env.useMock,
    isDev: env.isDev,
    isProd: env.isProd,
    mode: env.mode,
    rawUseMock: import.meta.env.VITE_USE_MOCK,
});
export { env };
//# sourceMappingURL=env.js.map