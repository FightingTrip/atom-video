# 部署指南

## 环境要求

### 服务器要求
- CPU: 4 核以上
- 内存: 8GB 以上
- 存储: 100GB 以上 SSD
- 操作系统: Ubuntu 22.04 LTS

### 软件要求
- Node.js 20.x LTS
- PostgreSQL 15.x
- Redis 7.x
- Nginx 1.18+
- PM2 5.x
- Docker 24.x
- Docker Compose 2.x

## 部署流程

### 1. 服务器准备

```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装必要软件
sudo apt install -y curl wget git

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm
npm install -g pnpm@8

# 安装 PostgreSQL
sudo apt install -y postgresql-15

# 安装 Redis
sudo apt install -y redis-server

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2
npm install -g pm2@5

# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 项目部署

```bash
# 创建项目目录
sudo mkdir -p /var/www/atom-video
sudo chown -R $USER:$USER /var/www/atom-video

# 克隆项目
cd /var/www/atom-video
git clone https://github.com/your-org/atom-video.git .

# 安装依赖
pnpm install

# 构建前端
cd packages/frontend
pnpm build

# 构建后端
cd ../backend
pnpm build
```

### 3. 数据库配置

```bash
# 创建数据库用户
sudo -u postgres createuser -P atom_video_user

# 创建数据库
sudo -u postgres createdb -O atom_video_user atom_video

# 配置数据库连接
cd /var/www/atom-video/packages/backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

### 4. Nginx 配置

```nginx
# /etc/nginx/sites-available/atom-video
server {
    listen 80;
    server_name atomvideo.com;

    # 前端静态文件
    location / {
        root /var/www/atom-video/packages/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件
    location /uploads {
        alias /var/www/atom-video/packages/backend/uploads;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/atom-video /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. PM2 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'atom-video-backend',
    script: 'packages/backend/dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

```bash
# 启动应用
cd /var/www/atom-video
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. SSL 配置

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d atomvideo.com

# 自动续期测试
sudo certbot renew --dry-run
```

## 环境变量配置

### 生产环境变量
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=atom_video_user
DB_PASSWORD=your_password
DB_DATABASE=atom_video

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_DIR=/var/www/atom-video/packages/backend/uploads
MAX_FILE_SIZE=100mb

# 前端配置
VITE_API_BASE_URL=https://api.atomvideo.com
```

## 监控配置

### 1. PM2 监控
```bash
# 安装 PM2 监控
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. 日志配置
```bash
# 创建日志目录
sudo mkdir -p /var/log/atom-video
sudo chown -R $USER:$USER /var/log/atom-video

# 配置日志轮转
sudo nano /etc/logrotate.d/atom-video
```

```conf
/var/log/atom-video/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 备份策略

### 1. 数据库备份
```bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/atom-video"
DATE=$(date +%Y%m%d_%H%M%S)
PGPASSWORD=your_password pg_dump -U atom_video_user -h localhost atom_video > $BACKUP_DIR/db_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# 设置定时任务
sudo crontab -e
```

```cron
0 2 * * * /usr/local/bin/backup-db.sh
```

### 2. 文件备份
```bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-files.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/atom-video"
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/atom-video/packages/backend/uploads
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# 设置定时任务
sudo crontab -e
```

```cron
0 3 * * * /usr/local/bin/backup-files.sh
```

## 故障恢复

### 1. 应用崩溃
```bash
# 查看日志
pm2 logs atom-video-backend

# 重启应用
pm2 restart atom-video-backend

# 如果持续崩溃，回滚到上一个版本
cd /var/www/atom-video
git checkout <previous-commit>
pnpm install
pnpm build
pm2 restart all
```

### 2. 数据库故障
```bash
# 恢复数据库
psql -U atom_video_user -d atom_video < /var/backups/atom-video/db_latest.sql
```

### 3. 文件系统故障
```bash
# 恢复上传文件
tar -xzf /var/backups/atom-video/files_latest.tar.gz -C /
```

## 安全配置

### 1. 防火墙配置
```bash
# 安装 UFW
sudo apt install -y ufw

# 配置防火墙
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 2. 系统安全
```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装安全工具
sudo apt install -y fail2ban

# 配置 fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

### 3. 应用安全
- 使用 HTTPS
- 配置 CORS
- 设置安全头部
- 启用 CSRF 保护
- 实现速率限制 