import { createI18n } from 'vue-i18n';

// 导入语言包
const messages = {
  'zh-CN': {
    header: {
      search: '搜索视频...',
      login: '登录',
      logout: '退出登录',
    },
    sidebar: {
      home: '首页',
      explore: '探索',
      subscriptions: '订阅',
      library: '收藏',
      history: '历史记录',
    },
    // 其他翻译内容
  },
  'en-US': {
    header: {
      search: 'Search videos...',
      login: 'Login',
      logout: 'Logout',
    },
    sidebar: {
      home: 'Home',
      explore: 'Explore',
      subscriptions: 'Subscriptions',
      library: 'Library',
      history: 'History',
    },
    // 其他翻译内容
  },
};

export const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: localStorage.getItem('language') || 'zh-CN', // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages,
});
