// 使用共享ESLint配置，Vue项目专用配置
import vueConfig from '@atom/eslint-config/vue';

export default {
  ...vueConfig,
  // 可以在这里添加或覆盖前端项目特定的规则
  rules: {
    ...vueConfig.rules,
    'vue/valid-template-root': 'error',
    'vue/no-multiple-template-root': 'off' // Vue 3允许多根模板
  }
}; 