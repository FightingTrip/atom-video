# 开发指南

本文档包含 Atom Video 项目的开发相关指南和规范。

## 开发相关文档

我们提供了以下开发相关文档，帮助您更好地参与项目开发：

1. [环境搭建指南](./setup.md) - 详细的环境配置步骤
2. [测试账号指南](./test-accounts.md) - 开发测试账号列表及使用方法
3. [Git 工作流程](./git-workflow.md) - 分支管理和提交规范
4. [编码规范](./coding-standards.md) - 代码风格和最佳实践
5. [测试指南](./testing.md) - 单元测试和集成测试指南
6. [贡献指南](./contributing.md) - 如何贡献代码到项目
7. [Monorepo 工作流程](./monorepo-workflow.md) - Monorepo 相关命令和实践

## 开发环境要求

- Node.js 18.x
- pnpm 8.15.4
- TypeScript 5.3.3
- PostgreSQL 15.x
- Redis 7.x

## 开发工具推荐

- VS Code
  - ESLint 插件
  - Prettier 插件
  - TypeScript Vue Plugin
  - Volar
- Git
- Docker Desktop
- Postman/Insomnia

## 项目结构

```
atom-video/
├── frontend/           # 前端项目
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   └── package.json   # 前端依赖
│
├── backend/           # 后端项目
│   ├── src/          # 源代码
│   │   ├── modules/  # 模块化结构
│   │   ├── common/   # 公共模块
│   │   └── main.ts   # 入口文件
│   └── package.json  # 后端依赖
│
└── docs/             # 项目文档
```

## 开发流程

1. 环境搭建
   - 克隆项目
   - 安装依赖
   - 配置环境变量
   - 启动开发服务器

2. 功能开发
   - 创建功能分支
   - 编写代码
   - 运行测试
   - 提交代码

3. 代码审查
   - 创建 Pull Request
   - 代码审查
   - 修改反馈
   - 合并代码

## 编码规范

请遵循以下编码规范：

1. TypeScript 规范
   - 使用 TypeScript 严格模式
   - 使用接口定义类型
   - 避免使用 any 类型
   - 使用枚举定义常量

2. Vue 规范
   - 使用组合式 API
   - 组件命名使用 PascalCase
   - Props 定义使用 TypeScript 类型
   - 使用 v-model 进行双向绑定

3. 后端规范
   - 使用依赖注入
   - 遵循 SOLID 原则
   - 使用装饰器进行路由定义
   - 使用中间件处理请求

## 测试规范

1. 单元测试
   - 使用 Jest 进行测试
   - 测试覆盖率要求 > 80%
   - 每个功能模块都需要测试

2. 集成测试
   - 使用 Supertest 进行 API 测试
   - 测试关键业务流程
   - 自动化测试脚本

## Git 工作流程

1. 分支管理
   - main: 主分支
   - develop: 开发分支
   - feature/*: 功能分支
   - hotfix/*: 紧急修复分支

2. 提交规范
   - feat: 新功能
   - fix: 修复 bug
   - docs: 文档更新
   - style: 代码格式
   - refactor: 代码重构
   - test: 测试相关
   - chore: 构建过程

## 部署流程

1. 开发环境
   - 本地开发服务器
   - 自动热重载
   - 开发工具集成

2. 测试环境
   - 自动化测试
   - 持续集成
   - 代码质量检查

3. 生产环境
   - Docker 容器化
   - 负载均衡
   - 监控告警

## 常见问题

1. 环境配置问题
   - Node.js 版本不匹配
   - 依赖安装失败
   - 环境变量配置错误

2. 开发问题
   - TypeScript 类型错误
   - API 接口调用失败
   - 数据库连接问题

3. 部署问题
   - Docker 构建失败
   - 服务启动失败
   - 性能问题

## 获取帮助

如果您在开发过程中遇到问题，可以通过以下方式获取帮助：

1. 查看文档
   - 技术文档
   - API 文档
   - 部署文档

2. 提交 Issue
   - 描述问题
   - 提供复现步骤
   - 附加错误日志

3. 联系维护者
   - GitHub Issues
   - 项目维护者 