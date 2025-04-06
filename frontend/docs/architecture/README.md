# Atom 前端架构文档

## 文档目录

1. [架构概述](./overview.md) - 前端架构的整体设计和原则
2. [项目结构](./project-structure.md) - 项目目录组织和命名规范
3. [组件系统](./component-system.md) - 组件设计和最佳实践
4. [状态管理](./state-management.md) - 状态设计和 Pinia 集成
5. [路由系统](./routing-system.md) - 路由配置和路由守卫
6. [API 集成](./api-integration.md) - API 客户端配置和请求处理
7. [样式系统](./styling-system.md) - CSS 架构和设计系统
8. [工程实践](./engineering-practices.md) - 开发规范和工具配置
9. [性能优化](./performance.md) - 性能优化策略
10. [测试策略](./testing.md) - 单元测试和集成测试方案
11. [部署流程](./deployment.md) - 构建和部署流程

## 架构图

![架构图](./images/architecture-diagram.png)

## 技术栈

- **核心框架**: Vue 3.x + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **CSS 方案**: 设计系统 + Tailwind CSS + 组件样式
- **测试框架**: Vitest + Vue Test Utils

## Monorepo 共享包

项目采用 Monorepo 结构，在 `packages/` 目录中包含以下共享包：

- **@atom/shared-types**: 共享的 TypeScript 类型定义
- **@atom/eslint-config**: 共享的 ESLint 配置规则
- **@atom/tsconfig**: 共享的 TypeScript 配置文件

每个包都可以在前端和后端项目中引用，提高代码复用和配置一致性。详细信息请参考[工程实践](./engineering-practices.md)文档。 