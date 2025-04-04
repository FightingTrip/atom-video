import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n';
import { create, NMessageProvider, NConfigProvider, darkTheme, lightTheme } from 'naive-ui';
import './style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

// 创建 Naive UI 实例
const naive = create({
  components: [NMessageProvider, NConfigProvider],
});

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(naive);

app.mount('#app');
