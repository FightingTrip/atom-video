# 贡献指南

## 开发流程

1. Fork 项目仓库
2. 创建功能分支
3. 提交代码更改
4. 创建 Pull Request

## 开发准备

### 环境要求
- Node.js >= 18
- PostgreSQL >= 15
- Redis >= 7
- FFmpeg >= 6
- pnpm >= 8

### 开发设置
```bash
# 克隆项目
git clone https://github.com/zjtdzyx/atom-video.git
cd atom-video

# 安装依赖
cd frontend
pnpm install

cd ../backend
pnpm install

# 配置环境变量
cp .env.example .env
```

## 代码规范

### JavaScript/TypeScript
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式

### Git 提交规范
提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- feat: 新功能
- fix: 修复
- docs: 文档更改
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 示例
```bash
git commit -m "feat(video): 添加视频转码功能" -m "1. 实现视频格式转换 2. 添加清晰度选择 3. 优化转码性能"
```

## 测试规范

### 单元测试
- 使用 Jest 进行测试
- 测试覆盖率要求 > 80%
- 测试文件命名：`*.test.ts`

### E2E 测试
- 使用 Cypress 进行测试
- 测试关键用户流程
- 测试文件位于 `tests/e2e`

## 文档规范

### API 文档
- 使用 OpenAPI (Swagger) 规范
- 详细描述请求/响应参数
- 提供请求示例

### 技术文档
- 使用 Markdown 格式
- 包含必要的代码示例
- 说明实现原理

## 审查流程

### Pull Request 要求
1. 通过所有自动化测试
2. 符合代码规范
3. 更新相关文档
4. 添加必要的测试
5. 描述清晰的变更内容

### 审查重点
- 代码质量
- 性能影响
- 安全考虑
- 兼容性
- 可维护性

## 发布流程

### 版本规范
遵循 [语义化版本](https://semver.org/lang/zh-CN/)：
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 发布步骤
1. 更新版本号
2. 生成更新日志
3. 创建发布标签
4. 部署到测试环境
5. 验证功能
6. 部署到生产环境

## 联系方式

- 项目负责人：[@zjtdzyx](https://github.com/zjtdzyx)
- 技术支持：yuxiangzhang040727@gmail.com
- 问题反馈：[Issues](https://github.com/zjtdzyx/atom-video/issues) 