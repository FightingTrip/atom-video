// 使用共享ESLint配置，Node.js项目专用配置
import nodeConfig from '@atom/eslint-config/node';

export default {
  ...nodeConfig,
  // 可以在这里添加或覆盖后端项目特定的规则
  rules: {
    ...nodeConfig.rules,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_', 
      varsIgnorePattern: '^_' 
    }],
    'no-console': 'off'
  }
}; 