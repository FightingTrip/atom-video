# CI/CD 配置

## GitHub Actions 工作流

### 1. 代码检查工作流

```yaml
# .github/workflows/lint.yml
name: Lint

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Run ESLint
        run: pnpm lint

      - name: Run Prettier
        run: pnpm format:check
```

### 2. 测试工作流

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
          DB_DATABASE: test
          REDIS_HOST: localhost
          REDIS_PORT: 6379
```

### 3. 构建工作流

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build frontend
        run: pnpm build:frontend
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Build backend
        run: pnpm build:backend

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: |
            packages/frontend/dist
            packages/backend/dist
```

### 4. 部署工作流

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build frontend
        run: pnpm build:frontend
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Build backend
        run: pnpm build:backend

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/atom-video
            git pull origin main
            pnpm install
            pnpm build
            pm2 restart atom-video-backend
            # 使用 nginx 部署前端静态文件
            cp -r dist/* /var/www/html/
```

## 环境变量配置

### GitHub Secrets
- `SERVER_HOST`: 服务器主机名
- `SERVER_USERNAME`: 服务器用户名
- `SERVER_SSH_KEY`: SSH 私钥
- `VITE_API_BASE_URL`: API 基础 URL
- `DB_HOST`: 数据库主机
- `DB_PORT`: 数据库端口
- `DB_USERNAME`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_DATABASE`: 数据库名称
- `REDIS_HOST`: Redis 主机
- `REDIS_PORT`: Redis 端口
- `JWT_SECRET`: JWT 密钥
- `JWT_EXPIRES_IN`: JWT 过期时间

## 部署策略

### 1. 蓝绿部署
- 维护两个相同的生产环境
- 新版本部署到备用环境
- 测试通过后切换流量
- 旧版本保留一段时间

### 2. 金丝雀发布
- 新版本先部署到少量服务器
- 监控性能和错误率
- 逐步扩大部署范围
- 完全替换旧版本

### 3. 滚动更新
- 逐个替换服务实例
- 保持服务可用性
- 自动回滚机制
- 健康检查

## 监控和告警

### 1. 应用监控
- 错误率监控
- 响应时间监控
- 资源使用监控
- 自定义指标监控

### 2. 告警规则
```yaml
# 错误率告警
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: High error rate on {{ $labels.instance }}
    description: Error rate is {{ $value }}%

# 响应时间告警
- alert: HighLatency
  expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: High latency on {{ $labels.instance }}
    description: 95th percentile latency is {{ $value }}s
```

### 3. 通知渠道
- Slack
- Email
- Webhook
- SMS

## 回滚策略

### 1. 自动回滚
- 监控关键指标
- 设置阈值
- 触发自动回滚
- 通知相关人员

### 2. 手动回滚
```bash
# 回滚到上一个版本
git checkout <previous-commit>
pnpm install
pnpm build
pm2 restart all
```

### 3. 数据库回滚
```bash
# 恢复数据库备份
psql -U $DB_USERNAME -d $DB_DATABASE < backup.sql
```

## 最佳实践

### 1. 代码质量
- 代码审查
- 自动化测试
- 静态代码分析
- 安全扫描

### 2. 部署流程
- 小步快跑
- 自动化部署
- 环境隔离
- 版本控制

### 3. 监控告警
- 全面监控
- 合理阈值
- 及时响应
- 持续优化

### 4. 安全措施
- 密钥管理
- 访问控制
- 日志审计
- 漏洞扫描 