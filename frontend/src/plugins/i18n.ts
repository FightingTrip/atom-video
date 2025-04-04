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
      categories: {
        title: '分类',
        tech: '技术探索',
        learning: '编程学习',
        webdev: 'Web开发',
      },
    },
    tags: {
      all: '全部',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      vue: 'Vue',
      react: 'React',
      nodejs: 'Node.js',
      python: 'Python',
    },
    footer: {
      terms: '使用条款',
      privacy: '隐私政策',
      help: '帮助中心',
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
      categories: {
        title: 'Categories',
        tech: 'Tech Exploration',
        learning: 'Programming',
        webdev: 'Web Development',
      },
    },
    tags: {
      all: 'All',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      vue: 'Vue',
      react: 'React',
      nodejs: 'Node.js',
      python: 'Python',
    },
    footer: {
      terms: 'Terms',
      privacy: 'Privacy',
      help: 'Help',
    },
    // 其他翻译内容
  },
};

export const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: localStorage.getItem('language') || 'zh-CN', // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages,
  globalInjection: true, // 添加这个选项以支持全局注入
});
