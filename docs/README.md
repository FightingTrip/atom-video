# Atom Video 项目文档

## 项目概述

Atom Video 是一个现代化的视频分享平台，提供高质量的视频上传、播放和社交功能。

## 文档目录

### 1. 项目介绍
- [项目背景](./introduction/background.md)
- [技术栈](./introduction/tech-stack.md)
- [项目结构](./introduction/project-structure.md)

### 2. 开发指南
- [环境搭建](./development/setup.md)
- [开发规范](./development/coding-standards.md)
- [Git 工作流](./development/git-workflow.md)
- [测试规范](./development/testing.md)

### 3. API 文档
- [API 概览](./api/README.md)
- [认证 API](./api/auth.md)
- [视频 API](./api/video.md)
- [用户 API](./api/user.md)

### 4. 部署文档
- [部署指南](./deployment/README.md)
- [CI/CD 配置](./deployment/ci-cd.md)
- [环境配置](./deployment/environment.md)

### 5. 架构设计
- [系统架构](./architecture/system.md)
- [数据库设计](./architecture/database.md)
- [缓存策略](./architecture/cache.md)

### 6. 运维文档
- [监控告警](./operations/monitoring.md)
- [日志管理](./operations/logging.md)
- [性能优化](./operations/performance.md)

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-org/atom-video.git
cd atom-video
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件配置必要的环境变量
```

4. 启动开发服务器
```bash
pnpm dev
```

## 贡献指南

请查看 [贡献指南](./CONTRIBUTING.md) 了解如何参与项目开发。

## 常见问题

请查看 [FAQ](./faq.md) 获取常见问题的解答。

## 联系我们

- 项目负责人：@your-name
- 技术支持：support@atomvideo.com
- 问题反馈：https://github.com/your-org/atom-video/issues 