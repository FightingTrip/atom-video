# Atom Video Frontend

基于 Vue 3 + TypeScript + Vite 构建的视频分享平台前端项目。

## 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 开发

1. 安装依赖

```bash
pnpm install
```

2. 运行开发服务器

使用模拟数据：
```bash
pnpm dev:mock
```

使用真实 API：
```bash
pnpm dev:api
```

## 构建

构建生产环境版本：
```bash
pnpm build
```

构建测试环境版本：
```bash
pnpm build:test
```

## 代码质量

运行代码检查：
```bash
pnpm lint        # ESLint
pnpm lint:style  # Stylelint
```

格式化代码：
```bash
pnpm format
```

类型检查：
```bash
pnpm type-check
```

## 环境配置

项目使用不同的环境配置文件：

- `.env.development` - 开发环境配置
- `.env.test` - 测试环境配置
- `.env.production` - 生产环境配置

可以通过 `VITE_USE_MOCK` 环境变量控制是否使用模拟数据。
