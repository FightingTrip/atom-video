# 数据库设计

## 1. 数据库选型

Atom Video 使用 PostgreSQL 作为主数据库，主要考虑以下因素：

- 强数据一致性和完整性
- 强大的查询能力
- 事务支持
- 成熟的全文搜索支持
- 良好的扩展性

## 2. 数据模型设计

### 2.1 用户表 (users)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    google_id VARCHAR(255) UNIQUE,
    github_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 2.2 视频表 (videos)

```sql
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    duration INTEGER,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_created_at ON videos(created_at);
```

### 2.3 标签表 (tags) 和视频标签关联表 (video_tags)

```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE video_tags (
    video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (video_id, tag_id)
);

CREATE INDEX idx_video_tags_video_id ON video_tags(video_id);
CREATE INDEX idx_video_tags_tag_id ON video_tags(tag_id);
```

### 2.4 评论表 (comments)

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### 2.5 点赞表 (likes)

```sql
CREATE TABLE likes (
    video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, user_id)
);

CREATE INDEX idx_likes_video_id ON likes(video_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
```

### 2.6 订阅表 (subscriptions)

```sql
CREATE TABLE subscriptions (
    subscriber_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subscribed_to_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (subscriber_id, subscribed_to_id)
);

CREATE INDEX idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_subscribed_to_id ON subscriptions(subscribed_to_id);
```

## 3. 数据关系

### 3.1 用户关系

- 一个用户可以上传多个视频（一对多）
- 一个用户可以发表多条评论（一对多）
- 一个用户可以点赞多个视频（多对多）
- 一个用户可以订阅多个用户（多对多）
- 一个用户可以被多个用户订阅（多对多）

### 3.2 视频关系

- 一个视频属于一个用户（多对一）
- 一个视频可以有多条评论（一对多）
- 一个视频可以被多个用户点赞（多对多）
- 一个视频可以有多个标签（多对多）

## 4. 数据迁移

### 4.1 版本控制

使用 Flyway 进行数据库版本控制，确保数据库结构变更的可追踪和可回滚。

### 4.2 迁移策略

1. 创建迁移脚本
2. 测试迁移
3. 执行迁移
4. 验证数据
5. 备份数据

## 5. 数据备份

### 5.1 备份策略

- 每日全量备份
- 实时 WAL 归档
- 异地备份存储

### 5.2 恢复策略

- 定期测试恢复流程
- 保留多个备份版本
- 快速恢复机制 