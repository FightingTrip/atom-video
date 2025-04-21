/**
 * @file main.ts
 * @description 应用程序入口文件
 * @created 2024-04-05
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // 导入持久化插件
import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n';
import setupNaiveUI from './plugins/naive-ui';
import { vPermission, vPermissionBtn } from './directives/permission';

// 导入样式 - 统一使用样式入口文件
import '@/styles/index.scss';

// 设置默认的环境变量
if (process.env.NODE_ENV === 'development') {
  console.log('App running in development mode');
}

// 创建Vue应用实例
const app = createApp(App);
const pinia = createPinia();

// 配置Pinia持久化插件
pinia.use(piniaPluginPersistedstate);

// 注册插件
app.use(pinia);
app.use(router);
app.use(i18n);
setupNaiveUI(app);

// 注册全局指令
app.directive('permission', vPermission);
app.directive('permission-btn', vPermissionBtn);

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  console.log('Error info:', info);
};

// 挂载应用到DOM
app.mount('#app');

console.log('Application mounted successfully');
