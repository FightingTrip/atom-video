import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import naive from './plugins/naive';
import './styles/tailwind.css';
import { i18n } from './plugins/i18n';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(naive);
app.use(i18n);

app.mount('#app');
