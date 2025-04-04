# 源代码目录结构说明

## 目录说明

- `assets/`: 静态资源文件（图片、字体等）
- `components/`: Vue 组件
- `composables/`: Vue 组合式函数
- `directives/`: Vue 自定义指令
- `locales/`: 国际化语言文件
- `mock/`: 模拟数据
- `plugins/`: Vue 插件
- `router/`: 路由配置
- `services/`: API 服务
- `stores/`: Pinia 状态管理
- `types/`: TypeScript 类型定义
- `utils/`: 工具函数
- `views/`: 页面级组件

## 主要文件说明

- `main.ts`: 应用入口文件
- `App.vue`: 根组件
- `env.d.ts`: 环境变量类型声明
- `style.css`: 全局样式
- `vite-env.d.ts`: Vite 环境变量类型声明

## 开发规范

1. 组件命名：
   - 页面组件使用 PascalCase（如 `Home.vue`）
   - 通用组件使用 PascalCase（如 `VideoCard.vue`）

2. 文件组织：
   - 相关的功能文件应放在同一目录下
   - 每个目录都应该有明确的职责

3. 类型定义：
   - 通用类型定义放在 `types/` 目录
   - 组件相关类型可以放在组件文件内

4. 样式规范：
   - 使用 Tailwind CSS 进行样式开发
   - 全局样式定义在 `style.css`
   - 组件样式使用 scoped 