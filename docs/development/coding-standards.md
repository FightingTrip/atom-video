# 开发规范

## 代码风格

### TypeScript/JavaScript

1. **命名规范**
   - 变量和函数使用 camelCase
   - 类和接口使用 PascalCase
   - 常量使用 UPPER_SNAKE_CASE
   - 私有属性使用 _prefix

2. **文件命名**
   - 组件文件：PascalCase（如 `UserProfile.vue`）
   - 工具文件：camelCase（如 `stringUtils.ts`）
   - 类型定义文件：PascalCase（如 `UserTypes.ts`）

3. **导入顺序**
   ```typescript
   // 1. Node 内置模块
   import path from 'path';
   
   // 2. 第三方模块
   import { ref } from 'vue';
   import express from 'express';
   
   // 3. 本地模块
   import { UserService } from '@/services';
   import { useAuth } from '@/composables';
   ```

4. **注释规范**
   ```typescript
   /**
    * 函数描述
    * @param {string} param1 - 参数1描述
    * @param {number} param2 - 参数2描述
    * @returns {Promise<boolean>} 返回值描述
    */
   ```

### Vue 组件

1. **文件结构**
   ```vue
   <template>
     <!-- 模板内容 -->
   </template>
   
   <script setup lang="ts">
   // 导入
   import { ref } from 'vue';
   
   // 类型定义
   interface Props {
     // ...
   }
   
   // props 和 emits
   const props = defineProps<Props>();
   const emit = defineEmits<{
     // ...
   }>();
   
   // 响应式数据
   const count = ref(0);
   
   // 计算属性
   const doubleCount = computed(() => count.value * 2);
   
   // 方法
   const increment = () => {
     count.value++;
   };
   
   // 生命周期钩子
   onMounted(() => {
     // ...
   });
   </script>
   
   <style scoped>
   /* 样式 */
   </style>
   ```

2. **Props 命名**
   - 在模板中使用 kebab-case
   - 在脚本中使用 camelCase

### CSS/SCSS

1. **命名规范**
   - 使用 BEM 命名规范
   - 组件级样式使用 scoped
   - 全局样式使用 CSS 变量

2. **样式顺序**
   ```css
   .element {
     /* 定位 */
     position: absolute;
     top: 0;
     right: 0;
     
     /* 盒模型 */
     display: flex;
     width: 100px;
     padding: 10px;
     
     /* 排版 */
     font-size: 16px;
     line-height: 1.5;
     
     /* 视觉效果 */
     background: #fff;
     border: 1px solid #ccc;
     
     /* 其他 */
     cursor: pointer;
     z-index: 1;
   }
   ```

## Git 工作流

1. **分支命名**
   - 功能分支：`feature/description`
   - 修复分支：`fix/description`
   - 文档分支：`docs/description`
   - 重构分支：`refactor/description`

2. **提交信息**
   ```
   <type>(<scope>): <description>
   
   [optional body]
   
   [optional footer]
   ```

3. **合并策略**
   - 使用 Squash and Merge
   - 保持提交历史清晰
   - 删除已合并的分支

## 测试规范

1. **单元测试**
   - 每个功能模块都应有对应的测试
   - 测试文件与源文件同目录
   - 使用 `.spec.ts` 或 `.test.ts` 后缀

2. **测试命名**
   ```typescript
   describe('UserService', () => {
     describe('create', () => {
       it('should create a new user', () => {
         // ...
       });
       
       it('should throw error if email exists', () => {
         // ...
       });
     });
   });
   ```

## 文档规范

1. **代码注释**
   - 复杂逻辑必须添加注释
   - 公共 API 必须添加 JSDoc 注释
   - 避免无意义的注释

2. **README 文件**
   - 每个项目都必须有 README
   - 包含项目描述、安装步骤、使用说明
   - 保持文档的及时更新

## 性能优化

1. **前端优化**
   - 使用路由懒加载
   - 合理使用缓存
   - 优化打包体积
   - 使用 CDN 加速

2. **后端优化**
   - 使用数据库索引
   - 实现缓存机制
   - 合理使用连接池
   - 优化查询性能 