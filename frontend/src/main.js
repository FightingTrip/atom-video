/**
 * @file main.ts
 * @description 应用程序入口文件
 * @created 2024-04-05
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n';
import setupNaiveUI from './plugins/naive-ui';
// 导入样式
import './styles/variables.css';
import './styles/main.css';
import './styles/tailwind.css';
const app = createApp(App);
const pinia = createPinia();
// 注册插件
app.use(pinia);
app.use(router);
app.use(i18n);
setupNaiveUI(app);
// 初始化主题
import { useThemeStore } from '@/stores/theme';
const themeStore = useThemeStore();
themeStore.initTheme();
app.mount('#app');
//# sourceMappingURL=main.js.map